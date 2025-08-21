export async function POST() {
  if (process.env.GUARDARIAN_ENABLED !== "true") {
    return new Response("Guardarian off-ramp is optional and currently disabled", { status: 403 });
  }
  
  // TODO: implement Guardarian off-ramp when needed as failover
  return new Response("Optional service - contact support", { status: 501 });
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