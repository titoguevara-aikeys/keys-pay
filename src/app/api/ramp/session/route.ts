import { verifyClient } from "@/app/api/_lib/verifyHmac";
import * as ramp from "@/lib/providers/ramp";

export async function POST(req: Request) {
  if (process.env.RAMP_ENABLED !== "true") {
    return new Response("disabled", { status: 403 });
  }
  
  const v = await verifyClient(req);
  if (!v.ok) {
    return new Response(JSON.stringify({ 
      code: "UNAUTHENTICATED", 
      message: v.reason 
    }), { status: 401 });
  }
  
  const body = await req.json();
  const out = await ramp.createSession(body);
  
  return Response.json({
    ...out,
    disclaimer: "Powered by Ramp. Keys Pay is an aggregator platform.",
    provider: "RAMP"
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-timestamp, x-signature',
    },
  });
}