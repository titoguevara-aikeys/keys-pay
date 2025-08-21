export async function GET() {
  const health = {
    ok: true,
    timestamp: new Date().toISOString(),
    service: 'keyspay',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    providers: {
      ramp: process.env.RAMP_ENABLED === "true",
      nium: process.env.NIUM_ENABLED === "true", 
      openpayd: process.env.OPENPAYD_ENABLED === "true"
    }
  };

  return Response.json(health, { 
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}