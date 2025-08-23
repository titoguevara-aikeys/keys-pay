export async function GET() {
  const startTime = Date.now();
  const featureEnabled = process.env.FEATURE_OPENPAYD === "true";
  
  if (!featureEnabled) {
    return Response.json({ 
      ok: false, 
      disabled: true,
      featureEnabled: false,
      message: "OpenPayd coming soon - feature disabled"
    });
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    
    // Test OpenPayd sandbox connectivity (when enabled)
    const response = await fetch("https://sandbox.openpayd.com/api/v1/health", {
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
      message: response.ok ? "OpenPayd sandbox reachable" : "OpenPayd sandbox unreachable"
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