import { NextRequest } from 'next/server';
import { createGuardarianProvider } from '@/src/lib/keyspay/providers/guardarian';
import { defaultRateLimiter } from '@/src/lib/keyspay/security';
import { logger } from '@/src/lib/keyspay/logger';
import { z } from 'zod';

const OffRampRequestSchema = z.object({
  asset: z.string().min(2).max(10), // e.g., "BTC", "ETH", "USDT"
  assetAmount: z.number().positive().max(1000), // Max amount varies by asset
  payoutCurrency: z.string().min(3).max(3), // e.g., "AED", "USD"
  country: z.string().min(2).max(2), // ISO country code
  payoutMethod: z.enum(['bank_transfer', 'card', 'mobile_money']),
  userId: z.string().optional(),
  returnUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional()
});

export async function POST(request: NextRequest) {
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const log = logger.child({ endpoint: 'offramp-session', clientIP });
  
  try {
    // Rate limiting
    if (!defaultRateLimiter.isAllowed(clientIP)) {
      log.warn('Rate limit exceeded');
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Parse and validate request
    const body = await request.json();
    const validatedRequest = OffRampRequestSchema.parse(body);
    
    log.info({ request: validatedRequest }, 'Creating off-ramp session');

    // Create provider instance
    const guardarian = createGuardarianProvider();
    
    // Create session
    const session = await guardarian.createOffRampSession(validatedRequest);
    
    log.info({ sessionId: session.sessionId, ref: session.ref }, 'Off-ramp session created');

    return Response.json({
      ...session,
      disclaimer: 'Virtual asset services provided by Guardarian. Keys Pay is a technology platform only.',
      merchantOfRecord: 'Guardarian'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Transaction-Ref': session.ref
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      log.warn({ validationErrors: error.errors }, 'Invalid request data');
      return Response.json({
        error: 'Invalid request data',
        details: error.errors
      }, { status: 400 });
    }

    log.error({ error }, 'Failed to create off-ramp session');
    return Response.json({
      error: 'Internal server error',
      message: 'Failed to create off-ramp session'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  });
}