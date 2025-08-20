import { NextRequest } from 'next/server';
import { createNiumProvider } from '@/src/lib/keyspay/providers/nium';
import { defaultRateLimiter } from '@/src/lib/keyspay/security';
import { logger } from '@/src/lib/keyspay/logger';
import { z } from 'zod';

const PayoutQuoteSchema = z.object({
  sourceCurrency: z.string().min(3).max(3), // e.g., "AED", "USD"
  targetCurrency: z.string().min(3).max(3), // e.g., "EUR", "GBP"
  amount: z.number().positive().max(100000), // Max $100k
  beneficiaryId: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export async function POST(request: NextRequest) {
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const log = logger.child({ endpoint: 'payout-quote', clientIP });
  
  try {
    // Rate limiting
    if (!defaultRateLimiter.isAllowed(clientIP)) {
      log.warn('Rate limit exceeded');
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Parse and validate request
    const body = await request.json();
    const validatedRequest = PayoutQuoteSchema.parse(body);
    
    log.info({ request: validatedRequest }, 'Creating payout quote');

    // Create provider instance
    const nium = createNiumProvider();
    
    // Get quote
    const quote = await nium.getPayoutQuote(validatedRequest);
    
    log.info({ quoteId: quote.quoteId, rate: quote.rate }, 'Payout quote created');

    return Response.json({
      ...quote,
      disclaimer: 'Payout services provided by Nium. Keys Pay is a technology platform only.',
      merchantOfRecord: 'Nium',
      termsAndConditions: 'https://nium.com/terms',
      rateDisclaimer: 'Exchange rates are subject to market fluctuations and may change before execution.'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Quote-Id': quote.quoteId,
        'Cache-Control': `max-age=${Math.floor(quote.ttlSeconds / 2)}` // Cache for half TTL
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

    log.error({ error }, 'Failed to create payout quote');
    return Response.json({
      error: 'Internal server error',
      message: 'Failed to create payout quote'
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