import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const parentId = request.headers.get('x-parent-id') || 'mock-user-1';
    
    // Mock family members data for development
    const mockMembers = [
      {
        id: 'family-1',
        customerHashId: 'cust-' + crypto.randomUUID(),
        walletHashId: 'wallet-' + crypto.randomUUID(),
        firstName: 'Emma',
        lastName: 'Johnson',
        email: 'emma@family.com',
        accountNumber: 'VA' + Math.random().toString().slice(2, 18),
        iban: `AE${Math.random().toString().slice(2, 20).padStart(18, '0')}`,
        balance: 125.50,
        spendingLimit: 200,
        dailyLimit: 50,
        status: 'active',
        cardDetails: {
          cardId: 'card-' + crypto.randomUUID(),
          last4: '4567',
          status: 'active'
        },
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        relationship_type: 'child'
      },
      {
        id: 'family-2',
        customerHashId: 'cust-' + crypto.randomUUID(),
        walletHashId: 'wallet-' + crypto.randomUUID(),
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex@family.com',
        accountNumber: 'VA' + Math.random().toString().slice(2, 18),
        iban: `AE${Math.random().toString().slice(2, 20).padStart(18, '0')}`,
        balance: 89.25,
        spendingLimit: 150,
        dailyLimit: 30,
        status: 'active',
        cardDetails: {
          cardId: 'card-' + crypto.randomUUID(),
          last4: '8901',
          status: 'active'
        },
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        relationship_type: 'child'
      }
    ];

    return Response.json({
      ok: true,
      data: mockMembers,
      total: mockMembers.length
    });
    
  } catch (error) {
    console.error('NIUM family members error:', error);
    
    return Response.json({
      ok: false,
      error: 'Failed to fetch family members',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}