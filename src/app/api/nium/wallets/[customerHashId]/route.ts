import { NextRequest } from 'next/server';
import { NiumClient } from '../../../../../../lib/nium/client';
import { z } from 'zod';

const ParamsSchema = z.object({
  customerHashId: z.string().uuid()
});

export async function GET(
  request: NextRequest,
  { params }: { params: { customerHashId: string } }
) {
  try {
    const { customerHashId } = ParamsSchema.parse(params);
    
    const client = new NiumClient();
    const clientHashId = process.env.NIUM_CLIENT_HASH_ID;
    
    const path = `/client/${clientHashId}/customer/${customerHashId}/wallet`;
    const result = await client.get(path);
    
    return Response.json({
      ok: true,
      data: result
    });
    
  } catch (error) {
    console.error('NIUM wallet error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({
        ok: false,
        code: 'INVALID_PARAMS',
        message: 'Invalid customer hash ID'
      }, { status: 400 });
    }
    
    return Response.json({
      ok: false,
      code: 'WALLET_ERROR',
      message: error instanceof Error ? error.message : 'Failed to fetch wallets'
    }, { status: 500 });
  }
}