import { NextRequest } from 'next/server';
import { createOpenPaydProvider } from '@/lib/keyspay/providers/openpayd';
import { defaultRateLimiter } from '@/lib/keyspay/security';
import { logger } from '@/lib/keyspay/logger';
import { z } from 'zod';

const IBANApplicationSchema = z.object({
  clientId: z.string().min(1),
  accountName: z.string().min(1).max(100),
  currency: z.string().min(3).max(3), // e.g., "EUR", "GBP", "USD"
  country: z.string().min(2).max(2), // ISO country code
  businessDetails: z.object({
    companyName: z.string().min(1).max(200),
    registrationNumber: z.string().min(1).max(50),
    businessType: z.string().min(1).max(50)
  }).optional(),
  metadata: z.record(z.any()).optional()
});

export async function POST(request: NextRequest) {
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const log = logger.child({ endpoint: 'iban-apply', clientIP });
  
  try {
    // Rate limiting
    if (!defaultRateLimiter.isAllowed(clientIP)) {
      log.warn('Rate limit exceeded');
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429 });
    }

    // Parse and validate request
    const body = await request.json();
    const validatedRequest = IBANApplicationSchema.parse(body);
    
    log.info({ clientId: validatedRequest.clientId, currency: validatedRequest.currency }, 'Creating IBAN application');

    // Create provider instance
    const openpayd = createOpenPaydProvider();
    
    // Create application
    const application = await openpayd.applyForIBAN(validatedRequest as any);
    
    log.info({ applicationId: application.applicationId }, 'IBAN application created');

    return Response.json({
      ...application,
      disclaimer: 'Banking services provided by OpenPayd. Keys Pay is a technology platform only.',
      merchantOfRecord: 'OpenPayd',
      termsAndConditions: 'https://openpayd.com/terms',
      privacyPolicy: 'https://openpayd.com/privacy'
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'X-Application-Id': application.applicationId
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

    log.error({ error }, 'Failed to create IBAN application');
    return Response.json({
      error: 'Internal server error',
      message: 'Failed to create IBAN application'
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