import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID || "keys-pay";
    const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
    
    const ok = !!(VERCEL_PROJECT_ID && VERCEL_TOKEN);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    
    return res.status(ok ? 200 : 503).json({
      ok,
      projectId: VERCEL_PROJECT_ID,
      message: ok ? "Vercel API credentials configured" : "Missing Vercel credentials"
    });
    
  } catch (error: any) {
    console.error('Vercel health check error:', error);
    return res.status(503).json({
      ok: false,
      error: error.message || 'Unknown error',
      projectId: process.env.VERCEL_PROJECT_ID || "keys-pay"
    });
  }
}