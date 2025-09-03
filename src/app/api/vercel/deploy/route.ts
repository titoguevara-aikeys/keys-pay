import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://emolyyvmvvfjyxbguhyn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI3NDIsImV4cCI6MjA2OTk3ODc0Mn0.u9KigfxzhqIXVjfRLRIqswCR5rCO8Mrapmk8yjr0wVU"
);

export async function POST(request: Request) {
  try {
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "aikey-mena-hub";
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    
    if (!VERCEL_TOKEN) {
      return Response.json({
        ok: false,
        error: "Missing VERCEL_TOKEN environment variable"
      }, { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { branch = 'main', auto = false } = await request.json().catch(() => ({}));
    
    console.log('Calling vercel-auto-deploy function with:', { 
      action: auto ? 'start-monitoring' : 'deploy',
      branch,
      projectId: VERCEL_PROJECT_ID 
    });
    
    const { data, error } = await supabase.functions.invoke('vercel-auto-deploy', {
      body: {
        action: auto ? 'start-monitoring' : 'deploy',
        config: {
          enabled: auto,
          branch,
          monitorInterval: 360 // 6 hours
        }
      }
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      return Response.json({
        ok: false,
        error: error.message || 'Failed to call auto-deploy function'
      }, { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (!data?.success) {
      return Response.json({
        ok: false,
        error: data?.error || 'Deployment failed'
      }, { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return Response.json({
      ok: true,
      ...data
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Deploy route error:', error);
    return Response.json({
      ok: false,
      error: error.message || 'Unknown error'
    }, { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET() {
  try {
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "aikey-mena-hub";
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    
    return Response.json({
      ok: true,
      message: "Vercel deploy API available",
      projectId: VERCEL_PROJECT_ID,
      hasToken: !!VERCEL_TOKEN,
      endpoints: {
        deploy: "POST /api/vercel/deploy",
        health: "GET /api/vercel/health", 
        deployments: "GET /api/vercel/deployments"
      }
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error: any) {
    console.error('Deploy GET route error:', error);
    return Response.json({
      ok: false,
      error: error.message || 'Unknown error'
    }, { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}