export async function GET() {
  try {
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "keys-pay";
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    
    const ok = !!(VERCEL_PROJECT_ID && VERCEL_TOKEN);
    
    return Response.json({
      ok,
      projectId: VERCEL_PROJECT_ID,
      message: ok ? "Vercel API credentials configured" : "Missing Vercel credentials"
    }, { 
      status: ok ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
  } catch (error: any) {
    console.error('Vercel health check error:', error);
    return Response.json({
      ok: false,
      error: error.message || 'Unknown error',
      projectId: process.env.VERCEL_PROJECT_ID || "keys-pay"
    }, { 
      status: 503,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}