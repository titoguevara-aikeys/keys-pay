import { verifyClient } from "@/app/api/_lib/verifyHmac";
import * as nium from "@/lib/providers/nium";

export async function POST(req: Request) {
  if (process.env.NIUM_ENABLED !== "true") {
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
  const quote = await nium.quote(body);
  
  return Response.json({
    ...quote,
    disclaimer: "Powered by Nium. Keys Pay is an aggregator platform.",
    provider: "NIUM"
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