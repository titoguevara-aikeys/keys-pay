import { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { spendingLimit, dailyLimit } = body;
    
    // Validate required fields
    if (!spendingLimit || !dailyLimit) {
      return Response.json({
        ok: false,
        error: 'Missing required fields',
        message: 'spendingLimit and dailyLimit are required'
      }, { status: 400 });
    }

    // Mock update response for development
    return Response.json({
      ok: true,
      data: {
        memberId: id,
        spendingLimit,
        dailyLimit,
        updated_at: new Date().toISOString()
      },
      message: 'Spending limits updated successfully via NIUM sandbox'
    });
    
  } catch (error) {
    console.error('NIUM update limits error:', error);
    
    return Response.json({
      ok: false,
      error: 'Failed to update spending limits',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}