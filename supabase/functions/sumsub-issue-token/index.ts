import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// HMAC-SHA256 signer for Sumsub
async function signSumsubRequest(secret: string, ts: string, method: string, path: string, body: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const data = enc.encode(ts + method.toUpperCase() + path + body);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  // Convert ArrayBuffer to hex string
  const bytes = new Uint8Array(signature);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const supabaseUser = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: req.headers.get("Authorization") || "" } },
    });
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get current user from JWT
    const { data: userData, error: userErr } = await supabaseUser.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { levelName, applicantEmail, applicantPhone, env } = await req.json().catch(() => ({ }));
    if (!levelName) {
      return new Response(JSON.stringify({ error: "Missing levelName" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const SUMSUB_APP_TOKEN = Deno.env.get("SUMSUB_APP_TOKEN");
    const SUMSUB_SECRET_KEY = Deno.env.get("SUMSUB_SECRET_KEY");
    if (!SUMSUB_APP_TOKEN || !SUMSUB_SECRET_KEY) {
      return new Response(JSON.stringify({ error: "Missing Sumsub secrets (SUMSUB_APP_TOKEN, SUMSUB_SECRET_KEY) in Supabase" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Sumsub base URL is the same; sandbox vs production is determined by the token pair
    const baseUrl = "https://api.sumsub.com";
    const externalUserId = userData.user.id; // stable identifier

    // 1) Idempotently create applicant (ignore 409 Exists)
    {
      const ts = Math.floor(Date.now() / 1000).toString();
      const path = `/resources/applicants?levelName=${encodeURIComponent(levelName)}`;
      const bodyObj: Record<string, unknown> = { externalUserId, source: "websdk" };
      if (applicantEmail) bodyObj["email"] = applicantEmail;
      if (applicantPhone) bodyObj["phone"] = applicantPhone;
      const body = JSON.stringify(bodyObj);
      const sig = await signSumsubRequest(SUMSUB_SECRET_KEY, ts, "POST", path, body);

      const createResp = await fetch(baseUrl + path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Token": SUMSUB_APP_TOKEN,
          "X-App-Access-Ts": ts,
          "X-App-Access-Sig": sig,
        },
        body,
      });
      if (!createResp.ok && createResp.status !== 409) {
        const err = await createResp.text();
        return new Response(JSON.stringify({ error: "Sumsub create applicant failed", details: err }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // 2) Generate WebSDK access token
    const ts2 = Math.floor(Date.now() / 1000).toString();
    const path2 = "/resources/accessTokens/sdk";
    const body2 = JSON.stringify({
      userId: externalUserId,
      levelName,
      applicantIdentifiers: {
        email: applicantEmail,
        phone: applicantPhone,
      },
      ttlInSecs: 600,
    });
    const sig2 = await signSumsubRequest(SUMSUB_SECRET_KEY, ts2, "POST", path2, body2);

    const tokenResp = await fetch(baseUrl + path2, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Token": SUMSUB_APP_TOKEN,
        "X-App-Access-Ts": ts2,
        "X-App-Access-Sig": sig2,
      },
      body: body2,
    });

    if (!tokenResp.ok) {
      const err = await tokenResp.text();
      return new Response(JSON.stringify({ error: "Sumsub access token failed", details: err }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const tokenJson = await tokenResp.json();

    // Optionally log access control event (silent)
    try {
      await supabaseAdmin.from("access_control_logs").insert({
        user_id: userData.user.id,
        action: "sumsub_issue_token",
        resource: "sumsub_websdk",
        success: true,
        metadata: { levelName, env: env || "sandbox" },
      });
    } catch (_e) {}

    return new Response(JSON.stringify({ token: tokenJson.token, userId: tokenJson.userId || externalUserId }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("sumsub-issue-token error", e);
    return new Response(JSON.stringify({ error: e?.message || "Unexpected error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});