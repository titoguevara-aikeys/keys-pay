export async function GET() {
  const providers = {
    ramp: {
      enabled: process.env.RAMP_ENABLED === "true",
      status: "operational",
      services: ["buy", "sell"]
    },
    nium: {
      enabled: process.env.NIUM_ENABLED === "true", 
      status: "operational",
      services: ["payouts", "cards"]
    },
    openpayd: {
      enabled: process.env.OPENPAYD_ENABLED === "true",
      status: "coming_soon",
      services: ["eiban"]
    }
  };

  return Response.json({
    providers,
    timestamp: new Date().toISOString(),
    disclaimer: "Keys Pay operates under AIKEYS (Dubai DED License 1483958, CR 2558995). Keys Pay is an aggregator technology platform."
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