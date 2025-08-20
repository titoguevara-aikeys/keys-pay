import { NextRequest } from 'next/server';
import { createTransakProvider } from '../../../../../lib/keyspay/providers/transak';
import { generateTransactionRef, defaultRateLimiter } from '../../../../../lib/keyspay/security';
import { logger } from '../../../../../lib/keyspay/logger';
import { z } from 'zod';

const OnRampRequestSchema = z.object({
  fiatCurrency: z.string().min(3).max(3), // e.g., "AED", "USD"
  fiatAmount: z.number().positive().max(50000), // Max $50k
  asset: z.string().min(2).max(10), // e.g., "BTC", "ETH", "USDT"
  country: z.string().min(2).max(2), // ISO country code
  userId: z.string().optional(),
  returnUrl: z.string().url().optional(),
  metadata: z.record(z.any()).optional()
});

export async function POST(request: NextRequest) {
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const log = logger.child({ endpoint: 'onramp-session', clientIP });
  
  try {
    // Rate limiting
    if (!defaultRateLimiter.isAllowed(clientIP)) {
      log.warn('Rate limit exceeded');
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Parse and validate request
    const body = await request.json();
    const validatedRequest = OnRampRequestSchema.parse(body);
    
    log.info({ request: validatedRequest }, 'Creating on-ramp session');

    // Create provider instance
    const transak = createTransakProvider();
    
    // Create session
    const session = await transak.createOnRampSession(validatedRequest);
    
    log.info({ sessionId: session.sessionId, ref: session.ref }, 'On-ramp session created');

    return Response.json({
      ...session,
      disclaimer: 'Virtual asset services provided by Transak. Keys Pay is a technology platform only.',
      merchantOfRecord: 'Transak'
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

    log.error({ error }, 'Failed to create on-ramp session');
    return Response.json({
      error: 'Internal server error',
      message: 'Failed to create on-ramp session'
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