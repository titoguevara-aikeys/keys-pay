import { NextRequest } from 'next/server';
import { NiumClient } from '../../../../../../lib/nium/client';
import { z } from 'zod';

const VirtualAccountSchema = z.object({
  customerHashId: z.string().uuid(),
  walletHashId: z.string().uuid(),
  currency: z.string().length(3)
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerHashId, walletHashId, currency } = VirtualAccountSchema.parse(body);
    
    const client = new NiumClient();
    const clientHashId = process.env.NIUM_CLIENT_HASH_ID;
    
    const path = `/client/${clientHashId}/customer/${customerHashId}/wallet/${walletHashId}/virtualAccount`;
    const payload = {
      currency,
      accountType: 'VIRTUAL'
    };
    
    const result = await client.post(path, payload);
    
    return Response.json({
      ok: true,
      accountNumber: result.accountNumber,
      routingCode: result.routingCode || result.sortCode,
      iban: result.iban,
      currency: result.currency || currency,
      data: result
    });
    
  } catch (error) {
    console.error('NIUM virtual account error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Invalid virtual account data',
        errors: error.errors
      }, { status: 400 });
    }
    
    return Response.json({
      ok: false,
      code: 'VIRTUAL_ACCOUNT_ERROR',
      message: error instanceof Error ? error.message : 'Failed to create virtual account'
    }, { status: 500 });
  }
}