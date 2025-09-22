import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Mock card issuance response for development
    const cardId = 'card-' + crypto.randomUUID();
    const last4 = Math.floor(1000 + Math.random() * 9000).toString();
    
    return Response.json({
      ok: true,
      cardId,
      last4,
      data: {
        memberId: id,
        cardId,
        last4,
        status: 'active',
        issued_at: new Date().toISOString()
      },
      message: 'Virtual card issued successfully via NIUM sandbox'
    });
    
  } catch (error) {
    console.error('NIUM issue card error:', error);
    
    return Response.json({
      ok: false,
      error: 'Failed to issue card',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}