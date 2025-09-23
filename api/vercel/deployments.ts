import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://emolyyvmvvfjyxbguhyn.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtb2x5eXZtdnZmanl4Ymd1aHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0MDI3NDIsImV4cCI6MjA2OTk3ODc0Mn0.u9KigfxzhqIXVjfRLRIqswCR5rCO8Mrapmk8yjr0wVU"
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "keys-pay";
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    
    if (!VERCEL_TOKEN) {
      return res.status(503).json({
        ok: false,
        error: "Missing VERCEL_TOKEN environment variable"
      });
    }

    const { data, error } = await supabase.functions.invoke('vercel-deployments', {
      body: {}
    });
    
    if (error) {
      console.error('Supabase function error:', error);
      return res.status(500).json({
        ok: false,
        error: error.message || 'Failed to fetch deployments'
      });
    }
    
    return res.status(200).json({
      ok: true,
      ...data
    });
    
  } catch (error: any) {
    console.error('Deployments route error:', error);
    return res.status(500).json({
      ok: false,
      error: error.message || 'Unknown error'
    });
  }
}