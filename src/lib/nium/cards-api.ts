// NIUM Cards API Integration for sandbox environment
import { MockNiumAPI } from './mock-api';

export interface NiumCard {
  id: string;
  cardId: string;
  customerId: string;
  cardNumber: string;
  maskedNumber: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  cardHolderName: string;
  cardType: 'virtual' | 'physical';
  cardSubType: 'debit' | 'prepaid';
  status: 'active' | 'blocked' | 'expired' | 'issued';
  balance: number;
  spendingLimit: number;
  dailyLimit: number;
  currency: string;
  activationUrl?: string;
  physicalCardStatus?: 'ordered' | 'shipped' | 'delivered';
  trackingNumber?: string;
  createdAt: string;
  activatedAt?: string;
}

export interface NiumCardTransaction {
  id: string;
  cardId: string;
  amount: number;
  currency: string;
  merchantName: string;
  merchantCategory: string;
  transactionType: 'purchase' | 'refund' | 'withdrawal';
  status: 'completed' | 'pending' | 'declined';
  authorizationCode: string;
  transactionDate: string;
  description: string;
  location?: {
    city: string;
    country: string;
  };
}

export interface NiumCardControls {
  cardId: string;
  isBlocked: boolean;
  isOnlineEnabled: boolean;
  isContactlessEnabled: boolean;
  isAtmEnabled: boolean;
  isPosEnabled: boolean;
  merchantCategories: {
    category: string;
    isEnabled: boolean;
  }[];
  geographicControls: {
    allowedCountries: string[];
    blockedCountries: string[];
  };
  spendingLimits: {
    daily: number;
    monthly: number;
    perTransaction: number;
  };
}

export class NiumCardsAPI {
  private mockApi = new MockNiumAPI();
  private baseUrl = '/api/cards';

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      // Add HMAC authentication headers
      const timestamp = Date.now().toString();
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          'x-timestamp': timestamp,
          'x-signature': 'demo-signature', // In production, this would be properly signed
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      // Fallback to mock API in development/sandbox
      console.warn('NIUM Cards API unavailable, using mock data:', error);
      return this.handleMockFallback(endpoint, options);
    }
  }

  private async handleMockFallback(endpoint: string, options: RequestInit = {}) {
    const method = options.method || 'GET';
    
    if (endpoint === '/health') {
      return this.mockApi.health();
    }
    
    // Generate mock card data for development
    return this.generateMockCardData(endpoint, method, options);
  }

  private generateMockCardData(endpoint: string, method: string, options: RequestInit): any {
    const mockCards: NiumCard[] = [
      {
        id: 'nium-card-1',
        cardId: 'card-' + crypto.randomUUID(),
        customerId: 'cust-' + crypto.randomUUID(),
        cardNumber: '4532123456789012',
        maskedNumber: '4532 **** **** 9012',
        last4: '9012',
        expiryMonth: '12',
        expiryYear: '2027',
        cardHolderName: 'John Doe',
        cardType: 'virtual',
        cardSubType: 'debit',
        status: 'active',
        balance: 1250.75,
        spendingLimit: 5000,
        dailyLimit: 1000,
        currency: 'USD',
        activationUrl: 'https://nium.sandbox/activate/card-123',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        activatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'nium-card-2',
        cardId: 'card-' + crypto.randomUUID(),
        customerId: 'cust-' + crypto.randomUUID(),
        cardNumber: '5555444433332222',
        maskedNumber: '5555 **** **** 2222',
        last4: '2222',
        expiryMonth: '08',
        expiryYear: '2028',
        cardHolderName: 'Jane Smith',
        cardType: 'physical',
        cardSubType: 'prepaid',
        status: 'active',
        balance: 850.25,
        spendingLimit: 3000,
        dailyLimit: 500,
        currency: 'USD',
        physicalCardStatus: 'delivered',
        trackingNumber: 'TR123456789',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        activatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'nium-card-3',
        cardId: 'card-' + crypto.randomUUID(),
        customerId: 'cust-' + crypto.randomUUID(),
        cardNumber: '4111111111111111',
        maskedNumber: '4111 **** **** 1111',
        last4: '1111',
        expiryMonth: '03',
        expiryYear: '2026',
        cardHolderName: 'Alex Johnson',
        cardType: 'virtual',
        cardSubType: 'debit',
        status: 'blocked',
        balance: 0,
        spendingLimit: 2000,
        dailyLimit: 300,
        currency: 'USD',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
    ];

    const mockTransactions: NiumCardTransaction[] = [
      {
        id: 'txn-1',
        cardId: 'nium-card-1',
        amount: 89.99,
        currency: 'USD',
        merchantName: 'Amazon',
        merchantCategory: 'Online Retail',
        transactionType: 'purchase',
        status: 'completed',
        authorizationCode: 'AUTH123456',
        transactionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Online purchase',
        location: { city: 'Seattle', country: 'US' }
      },
      {
        id: 'txn-2',
        cardId: 'nium-card-1',
        amount: 25.50,
        currency: 'USD',
        merchantName: 'Starbucks',
        merchantCategory: 'Food & Beverages',
        transactionType: 'purchase',
        status: 'completed',
        authorizationCode: 'AUTH789012',
        transactionDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Coffee purchase',
        location: { city: 'New York', country: 'US' }
      }
    ];

    // Route based on endpoint
    if (method === 'GET' && endpoint === '/list') {
      return {
        ok: true,
        data: mockCards,
        total: mockCards.length
      };
    }

    if (method === 'POST' && endpoint === '/issue') {
      const newCard: NiumCard = {
        id: 'nium-card-' + Date.now(),
        cardId: 'card-' + crypto.randomUUID(),
        customerId: 'cust-' + crypto.randomUUID(),
        cardNumber: '4532' + Math.floor(Math.random() * 1000000000000),
        maskedNumber: '4532 **** **** ' + Math.floor(1000 + Math.random() * 9000),
        last4: Math.floor(1000 + Math.random() * 9000).toString(),
        expiryMonth: '12',
        expiryYear: '2027',
        cardHolderName: 'New User',
        cardType: 'virtual',
        cardSubType: 'debit',
        status: 'issued',
        balance: 0,
        spendingLimit: 1000,
        dailyLimit: 200,
        currency: 'USD',
        activationUrl: 'https://nium.sandbox/activate/' + crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };

      return {
        ok: true,
        data: newCard,
        message: 'Card issued successfully via NIUM sandbox'
      };
    }

    if (endpoint.includes('/transactions')) {
      return {
        ok: true,
        data: mockTransactions,
        total: mockTransactions.length
      };
    }

    if (endpoint.includes('/controls')) {
      const controls: NiumCardControls = {
        cardId: 'nium-card-1',
        isBlocked: false,
        isOnlineEnabled: true,
        isContactlessEnabled: true,
        isAtmEnabled: true,
        isPosEnabled: true,
        merchantCategories: [
          { category: 'Online Retail', isEnabled: true },
          { category: 'Food & Beverages', isEnabled: true },
          { category: 'Gaming', isEnabled: false },
          { category: 'Adult Entertainment', isEnabled: false },
        ],
        geographicControls: {
          allowedCountries: ['US', 'CA', 'GB'],
          blockedCountries: []
        },
        spendingLimits: {
          daily: 1000,
          monthly: 5000,
          perTransaction: 500
        }
      };

      return {
        ok: true,
        data: controls
      };
    }

    // Default response
    return {
      ok: true,
      data: null,
      message: 'NIUM Cards Sandbox - Mock response'
    };
  }

  // Core card management methods
  async getCards(customerId?: string): Promise<{ ok: boolean; data: NiumCard[] }> {
    const params = customerId ? `?customerId=${customerId}` : '';
    return this.makeRequest(`/list${params}`, {
      method: 'GET',
    });
  }

  async issueCard(data: {
    customerId: string;
    cardType: 'virtual' | 'physical';
    cardSubType: 'debit' | 'prepaid';
    cardHolderName: string;
    spendingLimit: number;
    dailyLimit: number;
    currency?: string;
  }): Promise<{ ok: boolean; data: NiumCard }> {
    return this.makeRequest('/issue', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async activateCard(cardId: string, activationCode: string): Promise<{ ok: boolean }> {
    return this.makeRequest(`/${cardId}/activate`, {
      method: 'POST',
      body: JSON.stringify({ activationCode }),
    });
  }

  async blockCard(cardId: string, reason: string): Promise<{ ok: boolean }> {
    return this.makeRequest(`/${cardId}/block`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async unblockCard(cardId: string): Promise<{ ok: boolean }> {
    return this.makeRequest(`/${cardId}/unblock`, {
      method: 'POST',
    });
  }

  // Transaction management
  async getCardTransactions(cardId: string, limit = 50): Promise<{ ok: boolean; data: NiumCardTransaction[] }> {
    return this.makeRequest(`/${cardId}/transactions?limit=${limit}`);
  }

  // Card controls
  async getCardControls(cardId: string): Promise<{ ok: boolean; data: NiumCardControls }> {
    return this.makeRequest(`/${cardId}/controls`);
  }

  async updateCardControls(cardId: string, controls: Partial<NiumCardControls>): Promise<{ ok: boolean }> {
    return this.makeRequest(`/${cardId}/controls`, {
      method: 'PUT',
      body: JSON.stringify(controls),
    });
  }

  async updateSpendingLimits(cardId: string, limits: {
    daily?: number;
    monthly?: number;
    perTransaction?: number;
  }): Promise<{ ok: boolean }> {
    return this.makeRequest(`/${cardId}/limits`, {
      method: 'PATCH',
      body: JSON.stringify(limits),
    });
  }

  // Physical card management
  async orderPhysicalCard(data: {
    customerId: string;
    cardHolderName: string;
    shippingAddress: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  }): Promise<{ ok: boolean; data: NiumCard }> {
    return this.makeRequest('/physical/order', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async trackPhysicalCard(cardId: string): Promise<{ ok: boolean; data: { status: string; trackingNumber?: string } }> {
    return this.makeRequest(`/${cardId}/tracking`);
  }

  // Health check
  async healthCheck(): Promise<{ ok: boolean; env: string; timestamp: string }> {
    return this.makeRequest('/health');
  }
}

// Export singleton instance
export const niumCardsAPI = new NiumCardsAPI();