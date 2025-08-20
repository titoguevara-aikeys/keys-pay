import { logger } from '../logger';

export interface TransakConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  webhookSecret: string;
}

export interface OnRampRequest {
  fiatCurrency: string;
  fiatAmount: number;
  asset: string;
  country: string;
  userId?: string;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface OnRampResponse {
  provider: 'TRANSAK';
  sessionId: string;
  checkoutUrl: string;
  ref: string;
  status: 'created';
  expiresAt: string;
}

export interface TransakWebhookEvent {
  eventID: string;
  webhookData: {
    id: string;
    status: string;
    fiatCurrency: string;
    fiatAmount: number;
    cryptoCurrency: string;
    cryptoAmount: number;
    walletAddress?: string;
    transactionHash?: string;
    partnerOrderId?: string;
  };
}

export class TransakProvider {
  private config: TransakConfig;
  private mockMode: boolean;

  constructor(config: TransakConfig, mockMode = false) {
    this.config = config;
    this.mockMode = mockMode;
  }

  async createOnRampSession(request: OnRampRequest): Promise<OnRampResponse> {
    const log = logger.child({ provider: 'transak', method: 'createOnRampSession' });
    
    if (this.mockMode) {
      log.info('Creating mock Transak on-ramp session');
      const ref = `TRANSAK_${Date.now()}`;
      return {
        provider: 'TRANSAK',
        sessionId: `ts_mock_${Date.now()}`,
        checkoutUrl: `${this.config.baseUrl}/checkout?orderId=${ref}`,
        ref,
        status: 'created',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
      };
    }

    try {
      // Real Transak API implementation
      const params = new URLSearchParams({
        apiKey: this.config.apiKey,
        fiatCurrency: request.fiatCurrency,
        fiatAmount: request.fiatAmount.toString(),
        cryptoCurrencyCode: request.asset,
        countryCode: request.country,
        defaultPaymentMethod: 'credit_debit_card',
        ...(request.userId && { partnerCustomerId: request.userId }),
        ...(request.returnUrl && { redirectURL: request.returnUrl })
      });

      const checkoutUrl = `${this.config.baseUrl}/checkout?${params.toString()}`;
      const ref = `TRANSAK_${Date.now()}`;

      log.info({ ref, checkoutUrl }, 'Created Transak on-ramp session');

      return {
        provider: 'TRANSAK',
        sessionId: `ts_${Date.now()}`,
        checkoutUrl,
        ref,
        status: 'created',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
    } catch (error) {
      log.error({ error }, 'Failed to create Transak session');
      throw new Error('Failed to create on-ramp session');
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // Implement Transak webhook signature verification
    // This is a placeholder - implement according to Transak's webhook documentation
    return true;
  }

  parseWebhookEvent(payload: string): TransakWebhookEvent {
    return JSON.parse(payload);
  }

  mapStatus(transakStatus: string): 'created' | 'pending' | 'completed' | 'failed' | 'cancelled' {
    const statusMap: Record<string, 'created' | 'pending' | 'completed' | 'failed' | 'cancelled'> = {
      'AWAITING_PAYMENT_FROM_USER': 'pending',
      'PAYMENT_DONE_MARKED_BY_USER': 'pending',
      'PROCESSING': 'pending',
      'PENDING_DELIVERY_FROM_TRANSAK': 'pending',
      'ON_HOLD_PENDING_DELIVERY_FROM_TRANSAK': 'pending',
      'COMPLETED': 'completed',
      'CANCELLED': 'cancelled',
      'FAILED': 'failed',
      'REFUNDED': 'failed',
      'EXPIRED': 'failed'
    };

    return statusMap[transakStatus] || 'pending';
  }
}

export const createTransakProvider = (mockMode = process.env.NODE_ENV === 'development') => {
  const config: TransakConfig = {
    apiKey: process.env.TRANSAK_API_KEY || '',
    apiSecret: process.env.TRANSAK_API_SECRET || '',
    baseUrl: process.env.TRANSAK_BASE_URL || 'https://api.transak.com',
    webhookSecret: process.env.TRANSAK_WEBHOOK_SECRET || ''
  };

  return new TransakProvider(config, mockMode);
};