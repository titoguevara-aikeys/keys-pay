import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId') || 'mock-user-1';
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Mock family activities for development
    const mockActivities = [
      {
        id: 'act-1',
        childId: 'family-1',
        child_name: 'Emma Johnson',
        activity_type: 'allowance_paid',
        description: 'Weekly allowance payment received',
        amount: 25,
        currency: 'AED',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'act-2',
        childId: 'family-2',
        child_name: 'Alex Johnson',
        activity_type: 'card_transaction',
        description: 'Purchase at Local Cafe',
        amount: 12.50,
        currency: 'AED',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'act-3',
        childId: 'family-1',
        child_name: 'Emma Johnson',
        activity_type: 'account_created',
        description: 'NIUM virtual account created successfully',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'act-4',
        childId: 'family-2',
        child_name: 'Alex Johnson',
        activity_type: 'spending_limit_hit',
        description: 'Daily spending limit reached',
        amount: 30,
        currency: 'AED',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    return Response.json({
      ok: true,
      data: mockActivities.slice(0, limit),
      total: mockActivities.length
    });
    
  } catch (error) {
    console.error('NIUM family activity error:', error);
    
    return Response.json({
      ok: false,
      error: 'Failed to fetch family activity',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}