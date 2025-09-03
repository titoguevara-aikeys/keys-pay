import { serve } from "https://deno.land/std@0.208.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DeploymentHook {
  url: string
  secret?: string
}

interface AutoDeployConfig {
  enabled: boolean
  branch: string
  webhookUrl?: string
  monitorInterval?: number
}

async function triggerVercelDeployment(projectId: string, token: string, branch: string = 'main') {
  const deploymentUrl = `https://api.vercel.com/v13/deployments`
  
  const deploymentPayload = {
    name: 'keys-pay-auto-deploy',
    gitSource: {
      type: 'github',
      ref: branch,
      repoId: projectId
    },
    projectSettings: {
      buildCommand: 'npm run build',
      outputDirectory: 'dist'
    }
  }

  const response = await fetch(deploymentUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'Keys Pay Auto Deploy'
    },
    body: JSON.stringify(deploymentPayload)
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Vercel deployment failed: ${response.status} - ${error}`)
  }

  return await response.json()
}

async function checkForUpdates(projectId: string, token: string) {
  // Check for new commits or changes that should trigger deployment
  const deploymentsUrl = `https://api.vercel.com/v13/deployments?projectId=${projectId}&limit=1`
  
  const response = await fetch(deploymentsUrl, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'Keys Pay Auto Deploy Monitor'
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to check deployments: ${response.status}`)
  }

  const data = await response.json()
  return data.deployments || []
}

async function backgroundMonitoring(config: AutoDeployConfig, projectId: string, token: string) {
  console.log('Starting background deployment monitoring...')
  
  let lastDeploymentId: string | null = null
  
  const monitor = async () => {
    try {
      const deployments = await checkForUpdates(projectId, token)
      
      if (deployments.length > 0) {
        const latestDeployment = deployments[0]
        
        // If this is a new deployment or first run
        if (!lastDeploymentId) {
          lastDeploymentId = latestDeployment.uid
          console.log('Initialized monitoring with deployment:', latestDeploymentId)
          return
        }

        // Check if we need to trigger a new deployment
        // This could be based on various criteria like:
        // - Time since last deployment
        // - Manual trigger request
        // - Webhook notification
        
        const timeSinceLastDeploy = Date.now() - new Date(latestDeployment.createdAt).getTime()
        const sixHours = 6 * 60 * 60 * 1000

        // Auto-deploy if no deployment in the last 6 hours and it's enabled
        if (config.enabled && timeSinceLastDeploy > sixHours) {
          console.log('Triggering auto-deployment due to time threshold')
          const newDeployment = await triggerVercelDeployment(projectId, token, config.branch)
          lastDeploymentId = newDeployment.uid
          console.log('Auto-deployment triggered:', newDeployment.uid)
        }
      }
    } catch (error) {
      console.error('Background monitoring error:', error)
    }
  }

  // Run initial check
  await monitor()
  
  // Set up periodic monitoring
  const interval = config.monitorInterval || 30 * 60 * 1000 // 30 minutes default
  const intervalId = setInterval(monitor, interval)
  
  // Cleanup on function shutdown
  addEventListener('beforeunload', () => {
    console.log('Stopping deployment monitoring...')
    clearInterval(intervalId)
  })
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, config } = await req.json()
    
    // Get Vercel credentials from environment
    const projectId = Deno.env.get('VERCEL_PROJECT_ID')
    const token = Deno.env.get('VERCEL_TOKEN')
    
    if (!projectId || !token) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Vercel credentials not configured' 
        }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    switch (action) {
      case 'deploy': {
        // Trigger immediate deployment
        const branch = config?.branch || 'main'
        console.log(`Triggering deployment for branch: ${branch}`)
        
        const deployment = await triggerVercelDeployment(projectId, token, branch)
        
        return new Response(
          JSON.stringify({
            success: true,
            deployment: {
              id: deployment.uid,
              url: deployment.url,
              state: deployment.readyState || 'BUILDING'
            }
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      case 'start-monitoring': {
        // Start background monitoring
        const autoDeployConfig: AutoDeployConfig = {
          enabled: config?.enabled || false,
          branch: config?.branch || 'main',
          monitorInterval: config?.interval || 30 * 60 * 1000
        }
        
        console.log('Starting auto-deployment monitoring with config:', autoDeployConfig)
        
        // Start background monitoring without awaiting
        EdgeRuntime.waitUntil(backgroundMonitoring(autoDeployConfig, projectId, token))
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Auto-deployment monitoring started',
            config: autoDeployConfig
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      case 'webhook': {
        // Handle webhook deployments (e.g., from GitHub)
        console.log('Webhook deployment triggered')
        
        const branch = config?.branch || 'main'
        const deployment = await triggerVercelDeployment(projectId, token, branch)
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Webhook deployment triggered',
            deployment: {
              id: deployment.uid,
              url: deployment.url
            }
          }),
          { 
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      default: {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Invalid action. Use: deploy, start-monitoring, or webhook' 
          }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

  } catch (error) {
    console.error('Auto-deploy function error:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})