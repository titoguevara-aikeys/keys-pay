import { NextRequest } from 'next/server';
import { providerScoring } from '@/src/lib/keyspay/scoring';
import { logger } from '@/src/lib/keyspay/logger';

export async function GET(request: NextRequest) {
  const log = logger.child({ endpoint: 'providers' });
  
  try {
    const scores = providerScoring.getAllProviderScores();
    
    const providers = scores.map(score => ({
      name: score.name,
      health: score.score > 0.8 ? 'up' : score.score > 0.5 ? 'degraded' : 'down',
      score: score.score,
      uptime: score.uptime,
      avgResponseTime: score.avgResponseTime,
      successRate: score.successRate,
      lastUpdated: score.lastUpdated,
      services: getProviderServices(score.name),
      corridors: getProviderCorridors(score.name)
    }));

    const summary = {
      totalProviders: providers.length,
      healthyProviders: providers.filter(p => p.health === 'up').length,
      degradedProviders: providers.filter(p => p.health === 'degraded').length,
      downProviders: providers.filter(p => p.health === 'down').length,
      avgScore: providers.reduce((sum, p) => sum + p.score, 0) / providers.length,
      lastUpdated: new Date().toISOString()
    };

    log.info({ summary }, 'Provider status requested');

    return Response.json({
      summary,
      providers,
      disclaimer: 'All services are provided by independent licensed partners. Keys Pay is a technology platform only.'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=30' // Cache for 30 seconds
      }
    });

  } catch (error) {
    log.error({ error }, 'Failed to get provider status');
    return Response.json({
      error: 'Internal server error',
      message: 'Failed to get provider status'
    }, { status: 500 });
  }
}

function getProviderServices(providerName: string): string[] {
  const serviceMap: Record<string, string[]> = {
    'TRANSAK': ['onramp', 'crypto-purchase'],
    'GUARDARIAN': ['offramp', 'crypto-sale'],
    'NIUM': ['payouts', 'fx', 'cards', 'cross-border'],
    'OPENPAYD': ['iban', 'banking', 'settlement']
  };
  
  return serviceMap[providerName] || [];
}

function getProviderCorridors(providerName: string): string[] {
  const corridorMap: Record<string, string[]> = {
    'TRANSAK': ['AE-AED', 'EU-EUR', 'US-USD', 'GB-GBP'],
    'GUARDARIAN': ['AE-AED', 'EU-EUR', 'US-USD', 'GB-GBP'],
    'NIUM': ['AE-AED', 'EU-EUR', 'US-USD', 'GB-GBP', 'SG-SGD'],
    'OPENPAYD': ['EU-EUR', 'GB-GBP', 'US-USD']
  };
  
  return corridorMap[providerName] || [];
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}