import { verifyProviderWebhook, ack } from "@/lib/crypto/webhooks";

export async function POST(req: Request) {
  if (process.env.NIUM_ENABLED !== "true") {
    return new Response("disabled", { status: 403 });
  }
  
  const ok = await verifyProviderWebhook(
    req,
    process.env.NIUM_WEBHOOK_SECRET || "",
    "x-nium-signature",
    "x-nium-timestamp"
  );
  
  if (!ok) {
    return new Response("invalid", { status: 401 });
  }
  
  // TODO: map payout.processed/failed, card.issued/activated + idempotency
  const body = await req.json();
  console.log('Nium webhook received:', body);
  
  return ack();
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-nium-signature, x-nium-timestamp',
    },
  });
}