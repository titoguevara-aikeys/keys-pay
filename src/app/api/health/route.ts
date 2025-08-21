export async function GET() {
  const health = {
    ok: true,
    timestamp: new Date().toISOString(),
    service: "Keys Pay Platform",
    version: "1.0.0",
    license: "Dubai DED License 1483958, CR 2558995",
    model: "Non-custodial aggregator",
    environment: process.env.NODE_ENV,
    providers: {
      ramp: process.env.RAMP_ENABLED === "true",
      nium: process.env.NIUM_ENABLED === "true", 
      openpayd: process.env.OPENPAYD_ENABLED === "true",
      guardarian: process.env.GUARDARIAN_ENABLED === "true"
    },
    features: {
      buy_crypto: process.env.RAMP_ENABLED === "true",
      sell_crypto: process.env.RAMP_ENABLED === "true",
      cards: process.env.NIUM_ENABLED === "true",
      payouts: process.env.NIUM_ENABLED === "true",
      family_controls: process.env.NIUM_ENABLED === "true",
      eiban: process.env.OPENPAYD_ENABLED === "true"
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