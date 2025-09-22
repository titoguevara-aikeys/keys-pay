import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId') || 'mock-user-1';
    
    // Mock family stats for development
    const mockStats = {
      totalChildren: 2,
      activeChores: 5,
      pendingApprovals: 2,
      totalSavings: 214.75, // Sum of mock member balances
      weeklyAllowances: 50,
      completedGoals: 3,
      interestEarned: 12.75,
      avgProgressPercentage: 78
    };

    return Response.json({
      ok: true,
      data: mockStats
    });
    
  } catch (error) {
    console.error('NIUM family stats error:', error);
    
    return Response.json({
      ok: false,
      error: 'Failed to fetch family stats',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}