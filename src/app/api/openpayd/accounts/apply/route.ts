export async function POST() {
  if (process.env.OPENPAYD_ENABLED !== "true") {
    return new Response("disabled", { status: 403 });
  }
  
  // TODO: implement when approved
  return new Response("Coming Soon", { status: 501 });
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