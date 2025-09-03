import { validateServerEnv, serverEnv } from "@/lib/env";

export async function POST(req: Request) {
  try {
    validateServerEnv(['VERCEL_PROJECT_ID', 'VERCEL_TOKEN']);
    
    const { branch = 'main', auto = false } = await req.json();
    
    // Call the Supabase Edge Function for deployment
    const functionUrl = `${process.env.SUPABASE_URL}/functions/v1/vercel-auto-deploy`;
    const functionKey = process.env.SUPABASE_SERVICE_KEY;
    
    if (!functionUrl || !functionKey) {
      return Response.json({
        success: false,
        error: "Supabase configuration missing"
      }, { status: 500 });
    }

    const action = auto ? 'start-monitoring' : 'deploy';
    const config = {
      branch,
      enabled: auto,
      interval: 30 * 60 * 1000 // 30 minutes
    };

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${functionKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ action, config })
    });

    if (!response.ok) {
      const error = await response.text();
      return Response.json({
        success: false,
        error: `Deployment function failed: ${error}`
      }, { status: response.status });
    }

    const result = await response.json();
    
    return Response.json({
      success: true,
      ...result
    });
    
  } catch (error: any) {
    console.error('Deployment API error:', error);
    
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    validateServerEnv(['VERCEL_PROJECT_ID', 'VERCEL_TOKEN']);
    
    return Response.json({
      success: true,
      message: "Auto-deployment API is available",
      endpoints: {
        deploy: "POST /api/vercel/deploy - Trigger immediate deployment",
        monitor: "POST /api/vercel/deploy with auto:true - Start auto-deployment monitoring"
      }
    });
    
  } catch (error: any) {
    return Response.json({
      success: false,
      error: error.message
    }, { status: 503 });
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