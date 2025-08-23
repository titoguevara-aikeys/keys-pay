export async function GET() {
  const startTime = Date.now();
  const featureEnabled = process.env.FEATURE_RAMP !== "false";
  
  if (!featureEnabled) {
    return Response.json({ 
      ok: false, 
      featureEnabled: false,
      message: "Ramp feature disabled"
    });
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    // Test Ramp API connectivity
    const response = await fetch("https://api.ramp.network/api/host-api/configuration", {
      method: "GET",
      headers: {
        'User-Agent': 'Keys Pay Health Check'
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;
    
    return Response.json({
      ok: response.ok,
      latencyMs,
      featureEnabled: true,
      status: response.status,
      message: response.ok ? "Ramp API reachable" : "Ramp API unreachable"
    }, { status: response.ok ? 200 : 502 });
    
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    
    if (error.name === 'AbortError') {
      return Response.json({
        ok: false,
        latencyMs,
        featureEnabled: true,
        error: "Request timeout"
      }, { status: 408 });
    }
    
    return Response.json({
      ok: false,
      latencyMs,
      featureEnabled: true,
      error: error.message
    }, { status: 502 });
  }
}