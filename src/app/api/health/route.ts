import { NextRequest, NextResponse } from 'next/server';
import { createGuardarianProvider } from '@/lib/providers/guardarian';
import { createNymCardProvider } from '@/lib/providers/nymcard';
import { createWioProvider } from '@/lib/providers/wio';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    const { data: dbTest, error: dbError } = await supabaseAdmin
      .from('organizations')
      .select('id')
      .limit(1);

    const dbStatus = dbError ? 'down' : 'healthy';

    // Check provider status in parallel
    const [guardarianStatus, nymcardStatus, wioStatus] = await Promise.allSettled([
      createGuardarianProvider().getStatus(),
      createNymCardProvider().getStatus(),
      createWioProvider().getStatus(),
    ]);

    const responseTime = Date.now() - startTime;

    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      region: 'GCC',
      version: '1.0.0',
      response_time_ms: responseTime,
      services: {
        database: {
          status: dbStatus,
          response_time_ms: responseTime,
        },
        guardarian: guardarianStatus.status === 'fulfilled' 
          ? guardarianStatus.value 
          : { name: 'guardarian', status: 'down', error: guardarianStatus.reason },
        nymcard: nymcardStatus.status === 'fulfilled' 
          ? nymcardStatus.value 
          : { name: 'nymcard', status: 'down', error: nymcardStatus.reason },
        wio: wioStatus.status === 'fulfilled' 
          ? wioStatus.value 
          : { name: 'wio', status: 'down', error: wioStatus.reason },
      },
      features: {
        crypto_enabled: process.env.GUARDARIAN_ENABLED !== 'false',
        cards_enabled: process.env.NYMCARD_ENABLED !== 'false',
        banking_enabled: process.env.WIO_ENABLED !== 'false',
        demo_mode: process.env.DEMO_MODE === 'true',
      },
    };

    // Determine overall status
    const allServices = Object.values(health.services);
    const downServices = allServices.filter(service => service.status === 'down');
    const degradedServices = allServices.filter(service => service.status === 'degraded');

    if (downServices.length > 0) {
      health.status = downServices.length >= allServices.length / 2 ? 'down' : 'degraded';
    } else if (degradedServices.length > 0) {
      health.status = 'degraded';
    }

    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      status: 'down',
      timestamp: new Date().toISOString(),
      region: 'GCC',
      error: 'Health check failed',
      response_time_ms: Date.now() - startTime,
    }, { status: 503 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}