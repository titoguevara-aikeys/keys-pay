import { logger } from '../logger';

export interface NiumConfig {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  webhookSecret: string;
}

export interface PayoutQuoteRequest {
  sourceCurrency: string;
  targetCurrency: string;
  amount: number;
  beneficiaryId?: string;
  metadata?: Record<string, any>;
}

export interface PayoutQuoteResponse {
  quoteId: string;
  rate: number;
  fee: number;
  totalAmount: number;
  targetAmount: number;
  ttlSeconds: number;
  provider: 'NIUM';
}

export interface PayoutExecuteRequest {
  quoteId: string;
  reference: string;
  metadata?: Record<string, any>;
}

export interface PayoutExecuteResponse {
  ref: string;
  provider: 'NIUM';
  status: 'processing' | 'completed' | 'failed';
  updatedAt: string;
  raw: Record<string, any>;
}

export interface CardRequest {
  customerId: string;
  cardType: 'virtual' | 'physical';
  currency: string;
  metadata?: Record<string, any>;
}

export interface CardResponse {
  cardId: string;
  maskedPan: string;
  expiryMonth: string;
  expiryYear: string;
  cvv?: string; // Only for virtual cards, temporary
  status: 'active' | 'blocked' | 'expired';
  provider: 'NIUM';
}

export class NiumProvider {
  private config: NiumConfig;
  private mockMode: boolean;
  private accessToken?: string;
  private tokenExpiry?: number;

  constructor(config: NiumConfig, mockMode = false) {
    this.config = config;
    this.mockMode = mockMode;
  }

  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (this.mockMode) {
      this.accessToken = 'mock_access_token';
      this.tokenExpiry = Date.now() + 3600000; // 1 hour
      return this.accessToken;
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret
        })
      });

      if (!response.ok) {
        throw new Error(`Nium auth error: ${response.status}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000);
      
      return this.accessToken;
    } catch (error) {
      logger.error({ error }, 'Failed to get Nium access token');
      throw new Error('Failed to authenticate with Nium');
    }
  }

  async getPayoutQuote(request: PayoutQuoteRequest): Promise<PayoutQuoteResponse> {
    const log = logger.child({ provider: 'nium', method: 'getPayoutQuote' });

    if (this.mockMode) {
      log.info('Creating mock Nium payout quote');
      return {
        quoteId: `nq_mock_${Date.now()}`,
        rate: 3.67, // Mock AED to USD rate
        fee: 5.0,
        totalAmount: request.amount + 5.0,
        targetAmount: Math.round((request.amount * 3.67) * 100) / 100,
        ttlSeconds: 300, // 5 minutes
        provider: 'NIUM'
      };
    }

    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${this.config.baseUrl}/v1/quotes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceCurrency: request.sourceCurrency,
          destinationCurrency: request.targetCurrency,
          sourceAmount: request.amount,
          ...(request.beneficiaryId && { beneficiaryId: request.beneficiaryId })
        })
      });

      if (!response.ok) {
        throw new Error(`Nium quote error: ${response.status}`);
      }

      const data = await response.json();
      
      log.info({ quoteId: data.quoteId }, 'Created Nium payout quote');

      return {
        quoteId: data.quoteId,
        rate: data.exchangeRate,
        fee: data.fee,
        totalAmount: data.sourceAmount + data.fee,
        targetAmount: data.destinationAmount,
        ttlSeconds: data.validityInSeconds,
        provider: 'NIUM'
      };
    } catch (error) {
      log.error({ error }, 'Failed to get Nium quote');
      throw new Error('Failed to get payout quote');
    }
  }

  async executePayout(request: PayoutExecuteRequest): Promise<PayoutExecuteResponse> {
    const log = logger.child({ provider: 'nium', method: 'executePayout' });

    if (this.mockMode) {
      log.info('Executing mock Nium payout');
      const ref = `NX_MOCK_${Date.now()}`;
      return {
        ref,
        provider: 'NIUM',
        status: 'processing',
        updatedAt: new Date().toISOString(),
        raw: { mockTransactionId: ref }
      };
    }

    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${this.config.baseUrl}/v1/payouts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quoteId: request.quoteId,
          customerReference: request.reference,
          ...request.metadata
        })
      });

      if (!response.ok) {
        throw new Error(`Nium payout error: ${response.status}`);
      }

      const data = await response.json();
      const ref = `NX_${data.transactionId}`;
      
      log.info({ ref, transactionId: data.transactionId }, 'Executed Nium payout');

      return {
        ref,
        provider: 'NIUM',
        status: this.mapPayoutStatus(data.status),
        updatedAt: new Date().toISOString(),
        raw: data
      };
    } catch (error) {
      log.error({ error }, 'Failed to execute Nium payout');
      throw new Error('Failed to execute payout');
    }
  }

  async requestCard(request: CardRequest): Promise<CardResponse> {
    const log = logger.child({ provider: 'nium', method: 'requestCard' });

    if (this.mockMode) {
      log.info('Creating mock Nium card');
      return {
        cardId: `card_mock_${Date.now()}`,
        maskedPan: '4532 **** **** 1234',
        expiryMonth: '12',
        expiryYear: '27',
        cvv: request.cardType === 'virtual' ? '123' : undefined,
        status: 'active',
        provider: 'NIUM'
      };
    }

    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(`${this.config.baseUrl}/v1/cards`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerId: request.customerId,
          cardType: request.cardType,
          currency: request.currency,
          ...request.metadata
        })
      });

      if (!response.ok) {
        throw new Error(`Nium card error: ${response.status}`);
      }

      const data = await response.json();
      
      log.info({ cardId: data.cardId }, 'Created Nium card');

      return {
        cardId: data.cardId,
        maskedPan: data.maskedPan,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        cvv: request.cardType === 'virtual' ? data.cvv : undefined,
        status: 'active',
        provider: 'NIUM'
      };
    } catch (error) {
      log.error({ error }, 'Failed to create Nium card');
      throw new Error('Failed to create card');
    }
  }

  private mapPayoutStatus(niumStatus: string): 'processing' | 'completed' | 'failed' {
    const statusMap: Record<string, 'processing' | 'completed' | 'failed'> = {
      'PENDING': 'processing',
      'PROCESSING': 'processing',
      'COMPLETED': 'completed',
      'SETTLED': 'completed',
      'FAILED': 'failed',
      'REJECTED': 'failed',
      'CANCELLED': 'failed'
    };

    return statusMap[niumStatus] || 'processing';
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // Implement Nium webhook signature verification
    return true;
  }
}

export const createNiumProvider = (mockMode = process.env.NODE_ENV === 'development') => {
  const config: NiumConfig = {
    clientId: process.env.NIUM_CLIENT_ID || '',
    clientSecret: process.env.NIUM_CLIENT_SECRET || '',
    baseUrl: process.env.NIUM_BASE_URL || 'https://api.sandbox.nium.com',
    webhookSecret: process.env.NIUM_WEBHOOK_SECRET || ''
  };

  return new NiumProvider(config, mockMode);
};