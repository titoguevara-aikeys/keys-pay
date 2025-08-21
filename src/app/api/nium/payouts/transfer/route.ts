import { NextRequest } from 'next/server';
import { NiumClient } from '../../../../../../lib/nium/client';
import { z } from 'zod';

const TransferSchema = z.object({
  customerHashId: z.string().uuid(),
  walletHashId: z.string().uuid(),
  auditId: z.string(),
  amount: z.number().positive(),
  currency: z.string().length(3),
  beneficiaryId: z.string().optional(),
  beneficiaryInline: z.object({
    firstName: z.string(),
    lastName: z.string(),
    accountNumber: z.string(),
    bankCode: z.string().optional(),
    countryCode: z.string().length(2)
  }).optional()
}).refine(data => data.beneficiaryId || data.beneficiaryInline, {
  message: "Either beneficiaryId or beneficiaryInline must be provided"
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerHashId, walletHashId, auditId, amount, currency, beneficiaryId, beneficiaryInline } = TransferSchema.parse(body);
    
    const client = new NiumClient();
    const clientHashId = process.env.NIUM_CLIENT_HASH_ID;
    
    const path = `/client/${clientHashId}/customer/${customerHashId}/wallet/${walletHashId}/transferMoney`;
    const payload = {
      auditId,
      amount,
      currency,
      ...(beneficiaryId && { beneficiaryId }),
      ...(beneficiaryInline && { beneficiaryDetail: beneficiaryInline })
    };
    
    const result = await client.post(path, payload, walletHashId);
    
    return Response.json({
      ok: true,
      systemReferenceNumber: result.systemReferenceNumber || result.referenceId,
      status: result.status || 'INITIATED',
      data: result
    });
    
  } catch (error) {
    console.error('NIUM transfer error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Invalid transfer data',
        errors: error.errors
      }, { status: 400 });
    }
    
    return Response.json({
      ok: false,
      code: 'TRANSFER_ERROR',
      message: error instanceof Error ? error.message : 'Failed to execute transfer'
    }, { status: 500 });
  }
}