import { NextRequest } from 'next/server';
import { NiumClient } from '../../../../../lib/nium/client';
import { z } from 'zod';

const BeneficiarySchema = z.object({
  customerHashId: z.string().uuid(),
  beneficiaryDetail: z.object({
    firstName: z.string(),
    lastName: z.string(),
    nickname: z.string().optional(),
    contactDetails: z.object({
      emailId: z.string().email().optional(),
      mobileNumber: z.string().optional()
    }).optional()
  }),
  payoutDetail: z.object({
    beneficiaryAccountNumber: z.string(),
    beneficiaryBankCode: z.string().optional(),
    beneficiaryBankName: z.string().optional(),
    beneficiaryCountryCode: z.string().length(2),
    beneficiaryType: z.enum(['INDIVIDUAL', 'CORPORATE']).default('INDIVIDUAL')
  })
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerHashId, beneficiaryDetail, payoutDetail } = BeneficiarySchema.parse(body);
    
    const client = new NiumClient();
    const clientHashId = process.env.NIUM_CLIENT_HASH_ID;
    
    const path = `/client/${clientHashId}/customer/${customerHashId}/beneficiary`;
    const payload = {
      beneficiaryDetail,
      payoutDetail
    };
    
    const result = await client.post(path, payload);
    
    return Response.json({
      ok: true,
      beneficiaryId: result.beneficiaryHashId || result.id,
      data: result
    });
    
  } catch (error) {
    console.error('NIUM beneficiary error:', error);
    
    if (error instanceof z.ZodError) {
      return Response.json({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Invalid beneficiary data',
        errors: error.errors
      }, { status: 400 });
    }
    
    return Response.json({
      ok: false,
      code: 'BENEFICIARY_ERROR',
      message: error instanceof Error ? error.message : 'Failed to create beneficiary'
    }, { status: 500 });
  }
}