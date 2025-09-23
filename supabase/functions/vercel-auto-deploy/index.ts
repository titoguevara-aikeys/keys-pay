import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeploymentHook {
  url: string;
  secret?: string;
}

interface AutoDeployConfig {
  enabled: boolean;
  branch: string;
  webhookUrl?: string;
  monitorInterval?: number; // minutes
}

async function triggerVercelDeployment(projectId: string, token: string, branch: string = 'main') {
  console.log(`Triggering deployment for project: ${projectId}, branch: ${branch}`);
  
  const response = await fetch(`https://api.vercel.com/v6/deployments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: `keys-pay-${Date.now()}`,
      gitSource: {
        type: 'github',
        ref: branch,
        repoId: 'TBD' // keys-pay repository ID - update with actual repo ID
      },
      target: 'production',
      projectSettings: {
        framework: 'vite'
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Vercel deployment failed: ${error}`);
    throw new Error(`Vercel deployment failed: ${error}`);
  }

  const result = await response.json();
  console.log('Deployment triggered successfully:', result.id);
  return result;
}

async function checkForUpdates(projectId: string, token: string) {
  console.log(`Checking deployments for project: ${projectId}`);
  
  const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}&limit=1`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`Failed to check deployments: ${error}`);
    throw new Error(`Failed to check deployments: ${response.statusText}`);
  }

  const result = await response.json();
  console.log(`Found ${result.deployments?.length || 0} deployments`);
  return result;
}

let monitoringInterval: number | null = null;

async function backgroundMonitoring(projectId: string, token: string, config: AutoDeployConfig) {
  console.log('Starting background monitoring for auto-deployment');
  
  const checkInterval = (config.monitorInterval || 360) * 60 * 1000; // Convert to milliseconds, default 6 hours
  
  const monitor = async () => {
    try {
      const deployments = await checkForUpdates(projectId, token);
      const lastDeployment = deployments.deployments?.[0];
      
      if (!lastDeployment) {
        console.log('No deployments found, triggering initial deployment');
        await triggerVercelDeployment(projectId, token, config.branch);
        return;
      }

      const lastDeploymentTime = new Date(lastDeployment.createdAt);
      const now = new Date();
      const timeDiff = now.getTime() - lastDeploymentTime.getTime();
      
      if (timeDiff > checkInterval) {
        console.log(`Last deployment was ${Math.round(timeDiff / (1000 * 60 * 60))} hours ago, triggering new deployment`);
        await triggerVercelDeployment(projectId, token, config.branch);
      } else {
        console.log(`Last deployment was recent (${Math.round(timeDiff / (1000 * 60))} minutes ago), skipping`);
      }
    } catch (error) {
      console.error('Error in background monitoring:', error);
    }
  };

  // Initial check
  await monitor();
  
  // Set up interval
  monitoringInterval = setInterval(monitor, checkInterval);
  
  // Cleanup on Deno exit
  Deno.addSignalListener("SIGTERM", () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
    }
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, config }: { action: 'deploy' | 'start-monitoring' | 'webhook', config?: AutoDeployConfig } = await req.json();
    
    // Get Vercel credentials from environment
    const projectId = Deno.env.get('VERCEL_PROJECT_ID');
    const token = Deno.env.get('VERCEL_TOKEN');
    
    if (!projectId || !token) {
      return Response.json({
        error: 'Missing Vercel credentials. Please configure VERCEL_PROJECT_ID and VERCEL_TOKEN.',
        projectId: projectId || null,
        hasToken: !!token
      }, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    switch (action) {
      case 'deploy': {
        console.log('Triggering immediate deployment');
        const deployment = await triggerVercelDeployment(projectId, token, config?.branch || 'main');
        
        return Response.json({
          success: true,
          deployment: {
            id: deployment.id,
            url: deployment.url,
            readyState: deployment.readyState,
            createdAt: deployment.createdAt
          },
          message: 'Deployment triggered successfully'
        }, { headers: corsHeaders });
      }

      case 'start-monitoring': {
        if (!config) {
          return Response.json({
            error: 'Configuration required for monitoring'
          }, { 
            status: 400,
            headers: corsHeaders 
          });
        }

        console.log('Starting auto-deployment monitoring');
        
        // Start background monitoring (non-blocking)
        backgroundMonitoring(projectId, token, config).catch(console.error);
        
        return Response.json({
          success: true,
          message: 'Auto-deployment monitoring started',
          config: {
            enabled: config.enabled,
            branch: config.branch,
            interval: config.monitorInterval || 360
          }
        }, { headers: corsHeaders });
      }

      case 'webhook': {
        console.log('Processing webhook deployment trigger');
        const deployment = await triggerVercelDeployment(projectId, token, config?.branch || 'main');
        
        return Response.json({
          success: true,
          deployment: {
            id: deployment.id,
            url: deployment.url,
            readyState: deployment.readyState
          },
          message: 'Webhook deployment triggered'
        }, { headers: corsHeaders });
      }

      default:
        return Response.json({
          error: 'Invalid action. Use: deploy, start-monitoring, or webhook'
        }, { 
          status: 400,
          headers: corsHeaders 
        });
    }

  } catch (error) {
    console.error('Auto-deploy function error:', error);
    
    return Response.json({
      error: error.message || 'Unknown error occurred',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
})