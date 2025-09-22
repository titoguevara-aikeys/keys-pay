import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parentWalletId, childWalletId, amount, currency, description } = body;
    
    // Validate required fields
    if (!parentWalletId || !childWalletId || !amount || !currency) {
      return Response.json({
        ok: false,
        error: 'Missing required fields',
        message: 'parentWalletId, childWalletId, amount, and currency are required'
      }, { status: 400 });
    }

    // Mock transfer response for development
    const systemReferenceNumber = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    return Response.json({
      ok: true,
      systemReferenceNumber,
      data: {
        parentWalletId,
        childWalletId,
        amount,
        currency,
        description: description || 'Family transfer',
        systemReferenceNumber,
        status: 'completed',
        processed_at: new Date().toISOString()
      },
      message: 'Transfer completed successfully via NIUM sandbox'
    });
    
  } catch (error) {
    console.error('NIUM transfer error:', error);
    
    return Response.json({
      ok: false,
      error: 'Failed to process transfer',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}