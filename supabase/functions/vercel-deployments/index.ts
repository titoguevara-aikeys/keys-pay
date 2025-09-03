import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const VERCEL_TOKEN = Deno.env.get('VERCEL_TOKEN')
    let VERCEL_PROJECT_ID = Deno.env.get('VERCEL_PROJECT_ID')
    
    if (!VERCEL_TOKEN) {
      return Response.json({
        ok: false,
        error: 'VERCEL_TOKEN not configured'
      }, { 
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Auto-detect project if not configured
    if (!VERCEL_PROJECT_ID) {
      const projectsResponse = await fetch('https://api.vercel.com/v9/projects', {
        headers: {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        const projects = projectsData.projects || []
        
        const candidateProjects = projects.filter((p: any) => 
          p.name.toLowerCase().includes('aikey') || 
          p.name.toLowerCase().includes('mena') ||
          p.name.toLowerCase().includes('hub')
        )
        
        if (candidateProjects.length > 0) {
          VERCEL_PROJECT_ID = candidateProjects[0].id
        } else if (projects.length > 0) {
          VERCEL_PROJECT_ID = projects[0].id
        }
      }
    }

    if (!VERCEL_PROJECT_ID) {
      return Response.json({
        ok: false,
        error: 'No Vercel project found or configured'
      }, { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Fetch recent deployments
    const deploymentsResponse = await fetch(`https://api.vercel.com/v6/deployments?projectId=${VERCEL_PROJECT_ID}&limit=10`, {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!deploymentsResponse.ok) {
      const errorText = await deploymentsResponse.text()
      console.error('Vercel deployments API error:', errorText)
      return Response.json({
        ok: false,
        error: 'Failed to fetch deployments from Vercel API'
      }, { 
        status: deploymentsResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const deploymentsData = await deploymentsResponse.json()
    const deployments = deploymentsData.deployments || []
    
    // Process deployments data
    const processedDeployments = deployments.map((deployment: any) => ({
      id: deployment.uid,
      url: deployment.url,
      state: deployment.readyState || deployment.state,
      createdAt: deployment.createdAt,
      creator: deployment.creator?.username || deployment.creator?.email || 'Unknown',
      target: deployment.target || 'production',
      source: deployment.meta?.githubCommitMessage || 'Direct deployment'
    }))

    return Response.json({
      ok: true,
      total: deployments.length,
      deployments: processedDeployments,
      projectId: VERCEL_PROJECT_ID
    }, { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error: any) {
    console.error('Vercel deployments error:', error)
    return Response.json({
      ok: false,
      error: error.message || 'Unknown error'
    }, { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})