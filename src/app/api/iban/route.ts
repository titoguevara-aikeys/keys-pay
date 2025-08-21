export async function POST() {
  if (process.env.OPENPAYD_ENABLED !== "true") {
    return new Response("OpenPayd IBAN service is coming soon", { status: 403 });
  }
  
  // TODO: implement when OpenPayd is approved and enabled
  return new Response("Coming Soon", { status: 501 });
}

export async function GET() {
  if (process.env.OPENPAYD_ENABLED !== "true") {
    return new Response("OpenPayd IBAN service is coming soon", { status: 403 });
  }
  
  // TODO: implement when OpenPayd is approved and enabled
  return new Response("Coming Soon", { status: 501 });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-timestamp, x-signature',
    },
  });
}