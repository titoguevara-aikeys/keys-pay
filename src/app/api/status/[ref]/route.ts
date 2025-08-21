export async function GET(
  request: Request,
  { params }: { params: { ref: string } }
) {
  const { ref } = params;
  
  // TODO: Implement status lookup from provider webhooks storage
  // This would query a database table that stores webhook events by reference
  
  // Demo response structure
  const mockStatus = {
    ref,
    status: "completed", // created | authorized | processing | completed | failed
    provider: "ramp", // ramp | nium | openpayd
    type: "buy-crypto", // buy-crypto | sell-crypto | payout | card-issue | account-create
    amount: 1000,
    currency: "AED",
    asset: "BTC",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    events: [
      {
        status: "created",
        timestamp: new Date(Date.now() - 60000).toISOString(),
        provider: "ramp"
      },
      {
        status: "authorized", 
        timestamp: new Date(Date.now() - 30000).toISOString(),
        provider: "ramp"
      },
      {
        status: "completed",
        timestamp: new Date().toISOString(), 
        provider: "ramp"
      }
    ]
  };

  return Response.json({
    ...mockStatus,
    disclaimer: "Keys Pay operates under AIKEYS (Dubai DED License 1483958, CR 2558995). Keys Pay is an aggregator platform."
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