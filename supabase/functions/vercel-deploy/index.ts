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

    if (req.method === 'GET') {
      // Health check for auto-deploy function
      return Response.json({
        ok: true,
        message: 'Vercel auto-deploy function is ready',
        projectId: VERCEL_PROJECT_ID || 'Auto-detected'
      }, { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (req.method === 'POST') {
      const body = await req.json()
      const { branch = 'main', auto = false } = body

      if (!VERCEL_PROJECT_ID) {
        return Response.json({
          ok: false,
          error: 'No Vercel project found or configured'
        }, { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Trigger deployment
      const deployResponse = await fetch(`https://api.vercel.com/v13/deployments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: VERCEL_PROJECT_ID,
          gitSource: {
            type: 'github',
            ref: branch
          },
          target: 'production'
        })
      })

      if (!deployResponse.ok) {
        const errorText = await deployResponse.text()
        console.error('Vercel deployment API error:', errorText)
        
        // Try alternative deployment method
        const hookResponse = await fetch(`https://api.vercel.com/v1/integrations/deploy/prj_${VERCEL_PROJECT_ID}/${branch}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${VERCEL_TOKEN}`
          }
        })

        if (!hookResponse.ok) {
          return Response.json({
            ok: false,
            error: 'Failed to trigger deployment',
            details: errorText
          }, { 
            status: deployResponse.status,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          })
        }

        const hookData = await hookResponse.json()
        return Response.json({
          ok: true,
          success: true,
          deploymentId: hookData.id,
          message: 'Deployment triggered via hook',
          auto: auto
        }, { 
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const deployData = await deployResponse.json()
      
      // If auto-deploy is enabled, set up monitoring
      if (auto) {
        // Start background monitoring (simplified for now)
        console.log('Auto-deploy monitoring enabled for project:', VERCEL_PROJECT_ID)
      }

      return Response.json({
        ok: true,
        success: true,
        deploymentId: deployData.id,
        deploymentUrl: deployData.url,
        message: 'Deployment triggered successfully',
        auto: auto
      }, { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return Response.json({
      ok: false,
      error: 'Method not allowed'
    }, { 
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error: any) {
    console.error('Vercel deploy error:', error)
    return Response.json({
      ok: false,
      error: error.message || 'Unknown error'
    }, { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})