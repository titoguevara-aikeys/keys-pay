import { validateServerEnv, serverEnv } from "@/lib/env";

export async function GET() {
  try {
    validateServerEnv(['VERCEL_PROJECT_ID', 'VERCEL_TOKEN']);
    
    const ok = !!(serverEnv.VERCEL_PROJECT_ID && serverEnv.VERCEL_TOKEN);
    
    return Response.json({
      ok,
      projectId: serverEnv.VERCEL_PROJECT_ID || null,
      message: ok ? "Vercel API credentials configured" : "Missing Vercel credentials"
    }, { 
      status: ok ? 200 : 503 
    });
    
  } catch (error: any) {
    return Response.json({
      ok: false,
      error: error.message,
      projectId: null
    }, { status: 503 });
  }
}