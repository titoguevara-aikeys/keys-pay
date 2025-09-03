export async function GET() {
  const health = {
    ok: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: "Keys Pay Platform",
    version: process.env.npm_package_version || "1.0.0",
    license: "Dubai DED License 1483958, CR 2558995",
    model: "Non-custodial aggregator",
    environment: process.env.NODE_ENV || "development",
    providers: {
      ramp: process.env.FEATURE_RAMP !== "false",
      nium: process.env.FEATURE_NIUM !== "false", 
      openpayd: process.env.FEATURE_OPENPAYD === "true"
    },
    features: {
      buy_crypto: process.env.FEATURE_RAMP !== "false",
      sell_crypto: process.env.FEATURE_RAMP !== "false",
      cards: process.env.FEATURE_NIUM !== "false",
      payouts: process.env.FEATURE_NIUM !== "false",
      family_controls: process.env.FEATURE_NIUM !== "false",
      eiban: process.env.FEATURE_OPENPAYD === "true"
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