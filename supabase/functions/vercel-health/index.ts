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
    const VERCEL_PROJECT_ID = Deno.env.get('VERCEL_PROJECT_ID')
    
    console.log('Checking Vercel credentials...')
    console.log('VERCEL_PROJECT_ID:', VERCEL_PROJECT_ID)
    console.log('VERCEL_TOKEN present:', !!VERCEL_TOKEN)
    
    if (!VERCEL_TOKEN) {
      return Response.json({
        ok: false,
        error: 'VERCEL_TOKEN not configured',
        projectId: VERCEL_PROJECT_ID || 'Not set'
      }, { 
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Test API connection by fetching user info
    const userResponse = await fetch('https://api.vercel.com/v2/user', {
      headers: {
        'Authorization': `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      }
    })

    if (!userResponse.ok) {
      const errorData = await userResponse.text()
      console.error('Vercel API error:', errorData)
      return Response.json({
        ok: false,
        error: 'Invalid Vercel token or API error',
        details: errorData
      }, { 
        status: 503,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const userData = await userResponse.json()
    
    // If no project ID is set, try to auto-detect projects
    let projectInfo = null
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
        
        // Look for projects that might match our app
        const candidateProjects = projects.filter((p: any) => 
          p.name.toLowerCase().includes('aikey') || 
          p.name.toLowerCase().includes('mena') ||
          p.name.toLowerCase().includes('hub')
        )
        
        if (candidateProjects.length > 0) {
          projectInfo = candidateProjects[0]
        } else if (projects.length > 0) {
          projectInfo = projects[0] // Default to first project
        }
      }
    } else {
      // Verify the configured project exists
      const projectResponse = await fetch(`https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}`, {
        headers: {
          'Authorization': `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (projectResponse.ok) {
        projectInfo = await projectResponse.json()
      }
    }

    return Response.json({
      ok: true,
      projectId: projectInfo?.id || VERCEL_PROJECT_ID || 'Auto-detected',
      projectName: projectInfo?.name || 'Unknown',
      user: userData.user?.username || userData.user?.email,
      message: 'Vercel API connection successful',
      autoDetectedProject: !VERCEL_PROJECT_ID && projectInfo ? projectInfo : null
    }, { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
    
  } catch (error: any) {
    console.error('Vercel health check error:', error)
    return Response.json({
      ok: false,
      error: error.message || 'Unknown error'
    }, { 
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})