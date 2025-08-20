import { NextRequest } from 'next/server';
import { createNiumProvider } from '@/src/lib/keyspay/providers/nium';
import { defaultRateLimiter } from '@/src/lib/keyspay/security';
import { logger } from '@/src/lib/keyspay/logger';
import { z } from 'zod';

const PayoutExecuteSchema = z.object({
  quoteId: z.string().min(1),
  reference: z.string().min(1).max(100),
  metadata: z.record(z.any()).optional()
});

export async function POST(request: NextRequest) {
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const log = logger.child({ endpoint: 'payout-execute', clientIP });
  
  try {
    // Rate limiting - stricter for execution
    if (!defaultRateLimiter.isAllowed(`${clientIP}:execute`)) {
      log.warn('Rate limit exceeded for execution');
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Parse and validate request
    const body = await request.json();
    const validatedRequest = PayoutExecuteSchema.parse(body);
    
    log.info({ quoteId: validatedRequest.quoteId, reference: validatedRequest.reference }, 'Executing payout');

    // Create provider instance
    const nium = createNiumProvider();
    
    // Execute payout
    const execution = await nium.executePayout(validatedRequest);
    
    log.info({ ref: execution.ref, status: execution.status }, 'Payout execution initiated');

    return Response.json({
      ...execution,
      disclaimer: 'Payout services provided by Nium. Keys Pay is a technology platform only.',
      merchantOfRecord: 'Nium',
      statusCheckUrl: `/api/keyspay/status/${execution.ref}`
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Transaction-Ref': execution.ref
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

    log.error({ error }, 'Failed to execute payout');
    return Response.json({
      error: 'Internal server error',
      message: 'Failed to execute payout'
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