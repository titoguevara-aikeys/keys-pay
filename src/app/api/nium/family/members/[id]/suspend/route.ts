import { NextRequest } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Mock suspend response for development
    return Response.json({
      ok: true,
      data: {
        memberId: id,
        status: 'suspended',
        suspended_at: new Date().toISOString()
      },
      message: 'Family member suspended successfully via NIUM sandbox'
    });
    
  } catch (error) {
    console.error('NIUM suspend member error:', error);
    
    return Response.json({
      ok: false,
      error: 'Failed to suspend member',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}