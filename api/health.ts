import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).setHeader('Access-Control-Allow-Origin', '*')
      .setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
      .setHeader('Access-Control-Allow-Headers', 'Content-Type')
      .end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const health = {
      ok: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      service: "Keys Pay Platform",
      version: process.env.npm_package_version || "1.0.0",
      license: "Dubai DED License 1483958, CR 2558995",
      model: "Non-custodial aggregator",
      environment: process.env.NODE_ENV || "development",
      providers: {
        ramp: process.env.FEATURE_RAMP !== "false",
        nium: process.env.FEATURE_NIUM !== "false", 
        openpayd: process.env.FEATURE_OPENPAYD === "true"
      },
      features: {
        buy_crypto: process.env.FEATURE_RAMP !== "false",
        sell_crypto: process.env.FEATURE_RAMP !== "false",
        cards: process.env.FEATURE_NIUM !== "false",
        payouts: process.env.FEATURE_NIUM !== "false",
        family_controls: process.env.FEATURE_NIUM !== "false",
        eiban: process.env.FEATURE_OPENPAYD === "true"
      }
    };

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).json(health);
  } catch (error: any) {
    console.error('Health check error:', error);
    return res.status(503).json({
      ok: false,
      error: error.message || 'Unknown error'
    });
  }
}