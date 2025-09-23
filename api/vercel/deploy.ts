import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://emolyyvmvvfjyxbguhyn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI3NDIsImV4cCI6MjA2OTk3ODc0Mn0.u9KigfxzhqIXVjfRLRIqswCR5rCO8Mrapmk8yjr0wVU"
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200)
      .setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      .end();
  }

  if (req.method === 'POST') {
    try {
      const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "keys-pay";
      const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
      
      if (!VERCEL_TOKEN) {
        return res.status(503).json({
          ok: false,
          error: "Missing VERCEL_TOKEN environment variable"
        });
      }
      
      const { branch = 'main', auto = false } = req.body || {};
      
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
        return res.status(500).json({
          ok: false,
          error: error.message || 'Failed to call auto-deploy function'
        });
      }
      
      if (!data?.success) {
        return res.status(500).json({
          ok: false,
          error: data?.error || 'Deployment failed'
        });
      }
      
      return res.status(200).json({
        ok: true,
        ...data
      });
      
    } catch (error: any) {
      console.error('Deploy route error:', error);
      return res.status(500).json({
        ok: false,
        error: error.message || 'Unknown error'
      });
    }
  }

  if (req.method === 'GET') {
    try {
      const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "keys-pay";
      const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
      
      return res.status(200).json({
        ok: true,
        message: "Vercel deploy API available",
        projectId: VERCEL_PROJECT_ID,
        hasToken: !!VERCEL_TOKEN,
        endpoints: {
          deploy: "POST /api/vercel/deploy",
          health: "GET /api/vercel/health", 
          deployments: "GET /api/vercel/deployments"
        }
      });
      
    } catch (error: any) {
      console.error('Deploy GET route error:', error);
      return res.status(503).json({
        ok: false,
        error: error.message || 'Unknown error'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}