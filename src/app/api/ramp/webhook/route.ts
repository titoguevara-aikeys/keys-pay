import { verifyProviderWebhook, ack } from "@/lib/crypto/webhooks";

export async function POST(req: Request) {
  if (process.env.RAMP_ENABLED !== "true") {
    return new Response("disabled", { status: 403 });
  }
  
  const ok = await verifyProviderWebhook(
    req,
    process.env.RAMP_WEBHOOK_SECRET || "",
    "x-ramp-signature",
    "x-ramp-timestamp"
  );
  
  if (!ok) {
    return new Response("invalid", { status: 401 });
  }
  
  // TODO: map events: created/authorized/completed/failed + idempotency
  const body = await req.json();
  console.log('Ramp webhook received:', body);
  
  return ack();
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-ramp-signature, x-ramp-timestamp',
    },
  });
}