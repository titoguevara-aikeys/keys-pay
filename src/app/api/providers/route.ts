export async function GET() {
  const providers = {
    ramp: {
      status: process.env.RAMP_ENABLED === "true" ? "live" : "disabled",
      capabilities: ["buy-crypto", "sell-crypto"],
      description: "Fiat ↔ Crypto on/off-ramp"
    },
    nium: {
      status: process.env.NIUM_ENABLED === "true" ? "live" : "disabled", 
      capabilities: ["cards", "payouts", "fx", "family-controls"],
      description: "Virtual/physical cards & cross-border payouts"
    },
    openpayd: {
      status: process.env.OPENPAYD_ENABLED === "true" ? "live" : "coming-soon",
      capabilities: ["eiban", "accounts"],
      description: "European eIBAN accounts (Coming Soon)"
    },
    guardarian: {
      status: process.env.GUARDARIAN_ENABLED === "true" ? "optional" : "disabled",
      capabilities: ["offramp"],
      description: "Optional crypto off-ramp failover"
    }
  };

  return Response.json({
    providers,
    timestamp: new Date().toISOString(),
    platform: "Keys Pay Aggregator",
    license: "Dubai DED License 1483958, CR 2558995",
    model: "Non-custodial aggregator platform",
    disclaimer: "Keys Pay operates under AIKEYS (Dubai DED License 1483958, CR 2558995). Keys Pay is an aggregator platform. All payments, custody, and settlement are executed by regulated third-party providers."
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