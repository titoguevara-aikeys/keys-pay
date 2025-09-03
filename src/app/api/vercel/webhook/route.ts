import { validateServerEnv, serverEnv } from "@/lib/env";

export async function POST(req: Request) {
  try {
    // Verify webhook signature if configured
    const signature = req.headers.get('x-hub-signature-256');
    const event = req.headers.get('x-github-event');
    
    console.log('GitHub webhook received:', { event, signature: signature ? 'present' : 'missing' });
    
    if (!event) {
      return Response.json({
        success: false,
        error: "Missing GitHub event header"
      }, { status: 400 });
    }

    const payload = await req.json();
    
    // Only trigger deployments on push events to main/master branch
    if (event === 'push') {
      const branch = payload.ref?.replace('refs/heads/', '');
      const allowedBranches = ['main', 'master', 'production'];
      
      if (!allowedBranches.includes(branch)) {
        return Response.json({
          success: true,
          message: `Ignoring push to branch: ${branch}`,
          skipped: true
        });
      }

      console.log(`Push detected to ${branch} branch, triggering auto-deployment`);
      
      // Trigger deployment via Supabase Edge Function
      const functionUrl = `${process.env.SUPABASE_URL}/functions/v1/vercel-auto-deploy`;
      const functionKey = process.env.SUPABASE_SERVICE_KEY;
      
      if (!functionUrl || !functionKey) {
        return Response.json({
          success: false,
          error: "Supabase configuration missing"
        }, { status: 500 });
      }

      const deployResponse = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${functionKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          action: 'webhook',
          config: {
            branch,
            commit: payload.head_commit?.id,
            pusher: payload.pusher?.name,
            message: payload.head_commit?.message
          }
        })
      });

      if (!deployResponse.ok) {
        const error = await deployResponse.text();
        console.error('Webhook deployment failed:', error);
        return Response.json({
          success: false,
          error: `Webhook deployment failed: ${error}`
        }, { status: 500 });
      }

      const result = await deployResponse.json();
      
      console.log('Webhook deployment triggered successfully:', result);
      
      return Response.json({
        success: true,
        message: `Deployment triggered for ${branch}`,
        deployment: result.deployment,
        commit: payload.head_commit?.id,
        pusher: payload.pusher?.name
      });
    }

    // Handle other events (ping, etc.)
    return Response.json({
      success: true,
      message: `Received ${event} event`,
      processed: false
    });
    
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({
    success: true,
    message: "Vercel webhook endpoint is active",
    endpoints: {
      webhook: "POST /api/vercel/webhook - Handle GitHub webhook for auto-deployment"
    },
    instructions: {
      github: "Add this URL as a webhook in your GitHub repository settings",
      events: "Configure for 'push' events to trigger deployments",
      branches: "Only main, master, and production branches trigger deployments"
    }
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-hub-signature-256, x-github-event',
    },
  });
}