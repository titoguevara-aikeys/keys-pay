import { logger } from '../logger';

export interface GuardarianConfig {
  apiKey: string;
  baseUrl: string;
  webhookSecret: string;
}

export interface OffRampRequest {
  asset: string;
  assetAmount: number;
  payoutCurrency: string;
  country: string;
  payoutMethod: 'bank_transfer' | 'card' | 'mobile_money';
  userId?: string;
  returnUrl?: string;
  metadata?: Record<string, any>;
}

export interface OffRampResponse {
  provider: 'GUARDARIAN';
  sessionId: string;
  checkoutUrl: string;
  ref: string;
  status: 'created';
  expiresAt: string;
}

export interface GuardarianWebhookEvent {
  id: string;
  status: string;
  from_currency: string;
  from_amount: number;
  to_currency: string;
  to_amount: number;
  payout_info?: {
    iban?: string;
    account_number?: string;
    routing_number?: string;
  };
  partner_order_id?: string;
}

export class GuardarianProvider {
  private config: GuardarianConfig;
  private mockMode: boolean;

  constructor(config: GuardarianConfig, mockMode = false) {
    this.config = config;
    this.mockMode = mockMode;
  }

  async createOffRampSession(request: OffRampRequest): Promise<OffRampResponse> {
    const log = logger.child({ provider: 'guardarian', method: 'createOffRampSession' });
    
    if (this.mockMode) {
      log.info('Creating mock Guardarian off-ramp session');
      const ref = `GUARDARIAN_${Date.now()}`;
      return {
        provider: 'GUARDARIAN',
        sessionId: `gs_mock_${Date.now()}`,
        checkoutUrl: `${this.config.baseUrl}/checkout?orderId=${ref}`,
        ref,
        status: 'created',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
    }

    try {
      // Real Guardarian API implementation
      const payload = {
        from_currency: request.asset,
        from_amount: request.assetAmount,
        to_currency: request.payoutCurrency,
        payout_type: request.payoutMethod,
        ...(request.userId && { partner_customer_id: request.userId }),
        ...(request.returnUrl && { redirect_url: request.returnUrl })
      };

      // This would be a real API call to Guardarian
      const response = await fetch(`${this.config.baseUrl}/v1/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Guardarian API error: ${response.status}`);
      }

      const data = await response.json();
      const ref = `GUARDARIAN_${Date.now()}`;

      log.info({ ref, transactionId: data.id }, 'Created Guardarian off-ramp session');

      return {
        provider: 'GUARDARIAN',
        sessionId: data.id,
        checkoutUrl: data.redirect_url || `${this.config.baseUrl}/checkout/${data.id}`,
        ref,
        status: 'created',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString()
      };
    } catch (error) {
      log.error({ error }, 'Failed to create Guardarian session');
      throw new Error('Failed to create off-ramp session');
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // Implement Guardarian webhook signature verification
    return true;
  }

  parseWebhookEvent(payload: string): GuardarianWebhookEvent {
    return JSON.parse(payload);
  }

  mapStatus(guardarianStatus: string): 'created' | 'pending' | 'completed' | 'failed' | 'cancelled' {
    const statusMap: Record<string, 'created' | 'pending' | 'completed' | 'failed' | 'cancelled'> = {
      'waiting': 'pending',
      'confirming': 'pending',
      'exchanging': 'pending',
      'sending': 'pending',
      'finished': 'completed',
      'failed': 'failed',
      'refunded': 'failed',
      'expired': 'failed'
    };

    return statusMap[guardarianStatus] || 'pending';
  }
}

export const createGuardarianProvider = (mockMode = process.env.NODE_ENV === 'development') => {
  const config: GuardarianConfig = {
    apiKey: process.env.GUARDARIAN_API_KEY || '',
    baseUrl: process.env.GUARDARIAN_BASE_URL || 'https://api.guardarian.com',
    webhookSecret: process.env.GUARDARIAN_WEBHOOK_SECRET || ''
  };

  return new GuardarianProvider(config, mockMode);
};