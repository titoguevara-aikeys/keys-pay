import { NextRequest } from 'next/server';
import { NiumClient } from '../../../../../../lib/nium/client';
import { z } from 'zod';

const StatusSchema = z.object({
  customerHashId: z.string().uuid(),
  walletHashId: z.string().uuid(),
  systemReferenceNumber: z.string()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = {
      customerHashId: searchParams.get('customerHashId'),
      walletHashId: searchParams.get('walletHashId'),
      systemReferenceNumber: searchParams.get('systemReferenceNumber')
    };
    
    const { customerHashId, walletHashId, systemReferenceNumber } = StatusSchema.parse(params);
    
    const client = new NiumClient();
    const clientHashId = process.env.NIUM_CLIENT_HASH_ID;
    
    const path = `/client/${clientHashId}/customer/${customerHashId}/wallet/${walletHashId}/payout/${systemReferenceNumber}`;
    const result = await client.get(path, undefined, walletHashId);
    
    return Response.json({
      ok: true,
      status: result.status || 'UNKNOWN',
      systemReferenceNumber: result.systemReferenceNumber || systemReferenceNumber,
      data: result
    });
    
  } catch (error) {
    console.error('NIUM status error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({
        ok: false,
        code: 'INVALID_PARAMS',
        message: 'Invalid status parameters',
        errors: error.errors
      }, { status: 400 });
    }
    
    return Response.json({
      ok: false,
      code: 'STATUS_ERROR',
      message: error instanceof Error ? error.message : 'Failed to get payout status'
    }, { status: 500 });
  }
}