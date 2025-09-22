import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parentId, firstName, lastName, email, relationshipType, spendingLimit, dailyLimit } = body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !relationshipType) {
      return Response.json({
        ok: false,
        error: 'Missing required fields',
        message: 'firstName, lastName, email, and relationshipType are required'
      }, { status: 400 });
    }

    // Create mock family member for development
    const newMember = {
      id: 'family-' + Date.now(),
      customerHashId: 'cust-' + crypto.randomUUID(),
      walletHashId: 'wallet-' + crypto.randomUUID(),
      firstName,
      lastName,
      email,
      accountNumber: 'VA' + Math.random().toString().slice(2, 18),
      iban: `AE${Math.random().toString().slice(2, 20).padStart(18, '0')}`,
      balance: 0,
      spendingLimit: spendingLimit || 100,
      dailyLimit: dailyLimit || 25,
      status: 'active',
      cardDetails: {
        cardId: 'card-' + crypto.randomUUID(),
        last4: Math.floor(1000 + Math.random() * 9000).toString(),
        status: 'active'
      },
      created_at: new Date().toISOString(),
      relationship_type: relationshipType
    };

    return Response.json({
      ok: true,
      data: newMember,
      message: 'Family member created successfully via NIUM sandbox'
    });
    
  } catch (error) {
    console.error('NIUM create family member error:', error);
    
    return Response.json({
      ok: false,
      error: 'Failed to create family member',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}