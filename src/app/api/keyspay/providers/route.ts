import { NextRequest } from 'next/server';
import { chooseProvider } from '@/lib/keyspay/scoring';
import { logger } from '@/lib/keyspay/logger';

export async function GET(request: NextRequest) {
  const log = logger.child({ endpoint: 'providers' });
  
  try {
    // Mock provider scores since we don't have real metrics yet
    const mockProviders = [
      {
        name: 'TRANSAK',
        health: 'up' as const,
        score: 0.95,
        uptime: 99.8,
        avgResponseTime: 150,
        successRate: 98.5,
        lastUpdated: new Date().toISOString(),
        services: ['onramp', 'crypto-purchase'],
        corridors: ['AE-AED', 'EU-EUR', 'US-USD', 'GB-GBP']
      },
      {
        name: 'GUARDARIAN',
        health: 'up' as const,
        score: 0.92,
        uptime: 99.5,
        avgResponseTime: 180,
        successRate: 97.8,
        lastUpdated: new Date().toISOString(),
        services: ['offramp', 'crypto-sale'],
        corridors: ['AE-AED', 'EU-EUR', 'US-USD', 'GB-GBP']
      },
      {
        name: 'NIUM',
        health: 'up' as const,
        score: 0.94,
        uptime: 99.7,
        avgResponseTime: 120,
        successRate: 98.9,
        lastUpdated: new Date().toISOString(),
        services: ['payouts', 'fx', 'cards', 'cross-border'],
        corridors: ['AE-AED', 'EU-EUR', 'US-USD', 'GB-GBP', 'SG-SGD']
      },
      {
        name: 'OPENPAYD',
        health: 'up' as const,
        score: 0.93,
        uptime: 99.6,
        avgResponseTime: 160,
        successRate: 98.2,
        lastUpdated: new Date().toISOString(),
        services: ['iban', 'banking', 'settlement'],
        corridors: ['EU-EUR', 'GB-GBP', 'US-USD']
      }
    ];

    const summary = {
      totalProviders: mockProviders.length,
      healthyProviders: mockProviders.filter(p => p.health === 'up').length,
      degradedProviders: 0, // All are 'up' in mock
      downProviders: 0, // All are 'up' in mock
      avgScore: mockProviders.reduce((sum, p) => sum + p.score, 0) / mockProviders.length,
      lastUpdated: new Date().toISOString()
    };

    log.info({ summary }, 'Provider status requested');

    return Response.json({
      summary,
      providers: mockProviders,
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