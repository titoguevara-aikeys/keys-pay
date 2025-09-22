// NIUM Family API Integration for sandbox environment
import { MockNiumAPI } from './mock-api';

export interface NiumFamilyMember {
  id: string;
  customerHashId: string;
  walletHashId: string;
  firstName: string;
  lastName: string;
  email: string;
  accountNumber: string;
  iban: string;
  balance: number;
  spendingLimit: number;
  dailyLimit: number;
  status: 'active' | 'suspended' | 'closed';
  cardDetails?: {
    cardId: string;
    last4: string;
    status: 'active' | 'blocked' | 'expired';
  };
  created_at: string;
  relationship_type: string;
}

export interface NiumAllowanceTransaction {
  id: string;
  systemReferenceNumber: string;
  childId: string;
  amount: number;
  currency: string;
  description: string;
  status: 'processing' | 'completed' | 'failed';
  scheduledDate: string;
  processedAt?: string;
  frequency: 'weekly' | 'monthly' | 'one-time';
}

export interface NiumFamilyActivity {
  id: string;
  childId: string;
  child_name: string;
  activity_type: 'allowance_paid' | 'card_transaction' | 'spending_limit_hit' | 'account_created';
  description: string;
  amount?: number;
  currency?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export class NiumFamilyAPI {
  private mockApi = new MockNiumAPI();
  private baseUrl = '/api/nium';

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      console.log('🌐 Making request to:', `${this.baseUrl}${endpoint}`, 'with options:', options);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('🌐 Response status:', response.status, 'ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('🌐 Response data:', result);
      return result;
    } catch (error) {
      // Fallback to mock API in development/sandbox
      console.warn('NIUM API unavailable, using mock data:', error);
      return this.handleMockFallback(endpoint, options);
    }
  }

  private async handleMockFallback(endpoint: string, options: RequestInit = {}) {
    // Route to appropriate mock API method based on endpoint
    const method = options.method || 'GET';
    
    if (endpoint === '/health') {
      return this.mockApi.health();
    }
    
    // Generate mock family data for development
    return this.generateMockFamilyData(endpoint, method, options);
  }

  private generateMockFamilyData(endpoint: string, method: string, options: RequestInit): any {
    const mockMembers: NiumFamilyMember[] = [
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

    const mockActivities: NiumFamilyActivity[] = [
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
      }
    ];

    // Route based on endpoint
    if (endpoint.includes('family-members') || endpoint === '/family/members') {
      return {
        ok: true,
        data: mockMembers,
        total: mockMembers.length
      };
    }

    if (endpoint.includes('family-activity') || endpoint === '/family/activity') {
      return {
        ok: true,
        data: mockActivities.slice(0, 10),
        total: mockActivities.length
      };
    }

    if (endpoint.includes('family-stats') || endpoint === '/family/stats') {
      return {
        ok: true,
        data: {
          totalChildren: mockMembers.length,
          activeChores: 5,
          pendingApprovals: 2,
          totalSavings: mockMembers.reduce((sum, m) => sum + m.balance, 0),
          weeklyAllowances: 50,
          completedGoals: 3,
          interestEarned: 12.75,
          avgProgressPercentage: 78
        }
      };
    }

    if (method === 'POST' && endpoint.includes('create-member')) {
      const newMember: NiumFamilyMember = {
        id: 'family-' + Date.now(),
        customerHashId: 'cust-' + crypto.randomUUID(),
        walletHashId: 'wallet-' + crypto.randomUUID(),
        firstName: 'New',
        lastName: 'Child',
        email: 'new@family.com',
        accountNumber: 'VA' + Math.random().toString().slice(2, 18),
        iban: `AE${Math.random().toString().slice(2, 20).padStart(18, '0')}`,
        balance: 0,
        spendingLimit: 100,
        dailyLimit: 25,
        status: 'active',
        created_at: new Date().toISOString(),
        relationship_type: 'child'
      };

      return {
        ok: true,
        data: newMember,
        message: 'Family member created successfully via NIUM sandbox'
      };
    }

    // Default response
    return {
      ok: true,
      data: null,
      message: 'NIUM Sandbox - Mock response'
    };
  }

  // Core family member management
  async getFamilyMembers(parentId: string): Promise<{ ok: boolean; data: NiumFamilyMember[] }> {
    return this.makeRequest('/family/members', {
      method: 'GET',
      headers: { 'X-Parent-ID': parentId }
    });
  }

  async createFamilyMember(data: {
    parentId: string;
    firstName: string;
    lastName: string;
    email: string;
    relationshipType: string;
    spendingLimit: number;
    dailyLimit: number;
  }): Promise<{ ok: boolean; data: NiumFamilyMember }> {
    console.log('🔵 niumFamilyAPI.createFamilyMember called with:', data);
    const result = await this.makeRequest('/family/create-member', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    console.log('🔵 niumFamilyAPI.createFamilyMember result:', result);
    return result;
  }

  async updateSpendingLimits(memberId: string, limits: {
    spendingLimit: number;
    dailyLimit: number;
  }): Promise<{ ok: boolean }> {
    return this.makeRequest(`/family/members/${memberId}/limits`, {
      method: 'PATCH',
      body: JSON.stringify(limits),
    });
  }

  async suspendMember(memberId: string): Promise<{ ok: boolean }> {
    return this.makeRequest(`/family/members/${memberId}/suspend`, {
      method: 'POST',
    });
  }

  async reactivateMember(memberId: string): Promise<{ ok: boolean }> {
    return this.makeRequest(`/family/members/${memberId}/reactivate`, {
      method: 'POST',
    });
  }

  // Allowance and payment management
  async processAllowancePayment(data: {
    childId: string;
    amount: number;
    currency: string;
    description: string;
    frequency: 'weekly' | 'monthly' | 'one-time';
  }): Promise<{ ok: boolean; data: NiumAllowanceTransaction }> {
    return this.makeRequest('/family/allowance/pay', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async scheduleAllowance(data: {
    childId: string;
    amount: number;
    currency: string;
    frequency: 'weekly' | 'monthly';
    startDate: string;
  }): Promise<{ ok: boolean }> {
    return this.makeRequest('/family/allowance/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Card management for family members
  async issueChildCard(memberId: string): Promise<{ ok: boolean; cardId: string; last4: string }> {
    return this.makeRequest(`/family/members/${memberId}/card/issue`, {
      method: 'POST',
    });
  }

  async blockChildCard(memberId: string, cardId: string): Promise<{ ok: boolean }> {
    return this.makeRequest(`/family/members/${memberId}/card/${cardId}/block`, {
      method: 'POST',
    });
  }

  async unblockChildCard(memberId: string, cardId: string): Promise<{ ok: boolean }> {
    return this.makeRequest(`/family/members/${memberId}/card/${cardId}/unblock`, {
      method: 'POST',
    });
  }

  // Activity and reporting
  async getFamilyActivity(parentId: string, limit = 20): Promise<{ ok: boolean; data: NiumFamilyActivity[] }> {
    return this.makeRequest(`/family/activity?parentId=${parentId}&limit=${limit}`);
  }

  async getFamilyStats(parentId: string): Promise<{ ok: boolean; data: any }> {
    return this.makeRequest(`/family/stats?parentId=${parentId}`);
  }

  // Transfer money between family accounts
  async transferToChild(data: {
    parentWalletId: string;
    childWalletId: string;
    amount: number;
    currency: string;
    description: string;
  }): Promise<{ ok: boolean; systemReferenceNumber: string }> {
    return this.makeRequest('/family/transfer', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Health check for family features
  async healthCheck(): Promise<{ ok: boolean; env: string; timestamp: string }> {
    return this.makeRequest('/health');
  }
}

// Export singleton instance
export const niumFamilyAPI = new NiumFamilyAPI();