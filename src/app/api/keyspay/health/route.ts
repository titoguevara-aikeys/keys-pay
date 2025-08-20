import { NextRequest } from 'next/server';
import { logger } from '@/lib/keyspay/logger';

export async function GET(request: NextRequest) {
  const start = Date.now();
  
  try {
    // Basic health check
    const health = {
      ok: true,
      timestamp: new Date().toISOString(),
      service: 'keyspay',
      version: '1.0.0',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      responseTime: Date.now() - start
    };

    logger.info({ health }, 'Health check performed');
    
    return Response.json(health, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    logger.error({ error }, 'Health check failed');
    
    return Response.json({
      ok: false,
      error: 'Health check failed',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - start
    }, { status: 500 });
  }
}