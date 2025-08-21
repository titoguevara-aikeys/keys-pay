import { NextRequest } from 'next/server';
import { NiumClient } from '../../../../../../lib/nium/client';
import { z } from 'zod';

const QuoteSchema = z.object({
  customerHashId: z.string().uuid(),
  walletHashId: z.string().uuid(),
  sourceCurrency: z.string().length(3),
  destinationCurrency: z.string().length(3),
  amount: z.number().positive().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      customerHashId: searchParams.get('customerHashId'),
      walletHashId: searchParams.get('walletHashId'),
      sourceCurrency: searchParams.get('sourceCurrency'),
      destinationCurrency: searchParams.get('destinationCurrency'),
      amount: searchParams.get('amount') ? Number(searchParams.get('amount')) : undefined
    };
    
    const { customerHashId, walletHashId, sourceCurrency, destinationCurrency, amount } = QuoteSchema.parse(params);
    
    const client = new NiumClient();
    const clientHashId = process.env.NIUM_CLIENT_HASH_ID;
    
    const path = `/client/${clientHashId}/customer/${customerHashId}/wallet/${walletHashId}/fxLock`;
    const queryParams = new URLSearchParams({
      sourceCurrency,
      destinationCurrency,
      ...(amount && { amount: amount.toString() })
    });
    
    const result = await client.get(path, queryParams, walletHashId);
    
    return Response.json({
      ok: true,
      auditId: result.auditId,
      rate: result.exchangeRate || result.rate,
      holdExpiresAt: result.holdExpiresAt || new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      data: result
    });
    
  } catch (error) {
    console.error('NIUM quote error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({
        ok: false,
        code: 'INVALID_PARAMS',
        message: 'Invalid quote parameters',
        errors: error.errors
      }, { status: 400 });
    }
    
    return Response.json({
      ok: false,
      code: 'QUOTE_ERROR',
      message: error instanceof Error ? error.message : 'Failed to get FX quote'
    }, { status: 500 });
  }
}