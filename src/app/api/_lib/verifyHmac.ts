import { canonicalString, hmacHex, safeEqual } from "@/lib/crypto/hmac";

export async function verifyClient(request: Request) {
  const secret = process.env.HMAC_SHARED_SECRET || "";
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;
  
  const ts = request.headers.get("x-timestamp") || "0";
  const sig = request.headers.get("x-signature") || "";
  
  const skewMs = Math.abs(Date.now() - Number(ts));
  if (skewMs > 5 * 60 * 1000) return { ok: false, reason: "timestamp_skew" };
  
  const bodyText = ["POST","PUT","PATCH"].includes(method) ? await request.clone().text() : "";
  const payload = canonicalString(method, path, ts, bodyText);
  const expected = hmacHex(payload, secret);
  
  return { ok: safeEqual(expected, sig), reason: "bad_signature" };
}