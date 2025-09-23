export async function GET() {
  try {
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "keys-pay";
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    
    if (!VERCEL_TOKEN) {
      return Response.json({
        ok: false,
        error: "Missing VERCEL_TOKEN",
        items: [],
        total: 0
      }, { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const url = new URL("https://api.vercel.com/v13/deployments");
    url.searchParams.set("projectId", VERCEL_PROJECT_ID);
    url.searchParams.set("limit", "5");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url.toString(), {
      headers: { 
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'User-Agent': 'Keys Pay System Check',
        'Content-Type': 'application/json'
      },
      signal: controller.signal,
      cache: "no-store"
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      return Response.json({
        ok: false, 
        status: response.status,
        error: `Vercel API returned ${response.status}: ${errorText}`,
        items: [],
        total: 0
      }, { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const data = await response.json();
    const items = (data.deployments || []).map((d: any) => ({
      id: d.uid || d.id,
      url: d.url,
      state: d.state || d.readyState,
      createdAt: d.createdAt,
      creator: d.creator?.username || d.creator?.email || "Unknown"
    }));
    
    return Response.json({ 
      ok: true, 
      items,
      total: items.length 
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Vercel deployments error:', error);
    
    if (error.name === 'AbortError') {
      return Response.json({
        ok: false,
        error: "Request timeout",
        items: [],
        total: 0
      }, { 
        status: 408,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return Response.json({
      ok: false,
      error: error.message || 'Unknown error',
      items: [],
      total: 0
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}