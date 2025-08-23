import { validateServerEnv, serverEnv } from "@/lib/env";

export async function GET() {
  try {
    validateServerEnv(['VERCEL_PROJECT_ID', 'VERCEL_TOKEN']);
    
    const url = new URL("https://api.vercel.com/v13/deployments");
    url.searchParams.set("projectId", serverEnv.VERCEL_PROJECT_ID!);
    url.searchParams.set("limit", "5");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url.toString(), {
      headers: { 
        Authorization: `Bearer ${serverEnv.VERCEL_TOKEN}`,
        'User-Agent': 'Keys Pay System Check'
      },
      signal: controller.signal,
      cache: "no-store"
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return Response.json({
        ok: false, 
        status: response.status,
        error: `Vercel API returned ${response.status}`
      }, { status: response.status });
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
    });
    
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return Response.json({
        ok: false,
        error: "Request timeout"
      }, { status: 408 });
    }
    
    return Response.json({
      ok: false,
      error: error.message
    }, { status: 500 });
  }
}