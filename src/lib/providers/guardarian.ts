// Guardarian Crypto Provider Implementation
import type { CryptoProvider, CryptoCheckoutParams, CryptoCheckoutResponse } from './index';

class GuardarianProvider implements CryptoProvider {
  name = 'guardarian';
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
  webhookSecret: string;

  constructor(config: {
    baseUrl: string;
    apiKey: string;
    webhookSecret: string;
    enabled?: boolean;
  }) {
    this.baseUrl = config.baseUrl;
    this.apiKey = config.apiKey;
    this.webhookSecret = config.webhookSecret;
    this.enabled = config.enabled ?? true;
  }

  async createCheckout(params: CryptoCheckoutParams): Promise<CryptoCheckoutResponse> {
    if (!this.enabled) {
      throw new Error('Guardarian provider is disabled');
    }

    const response = await fetch(`${this.baseUrl}/v1/transaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        from_currency: params.side === 'buy' ? params.fiatCurrency : params.cryptoCurrency,
        to_currency: params.side === 'buy' ? params.cryptoCurrency : params.fiatCurrency,
        from_amount: params.fiatAmount,
        payout_address: params.side === 'buy' ? 'user_wallet_address' : undefined,
        external_partner_link_id: params.userId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Guardarian API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      checkoutUrl: data.redirect_url,
      orderId: data.id,
      provider: 'guardarian',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
    };
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // TODO: Implement HMAC verification
    // const expectedSignature = crypto
    //   .createHmac('sha256', this.webhookSecret)
    //   .update(payload)
    //   .digest('hex');
    // return crypto.timingSafeEqual(
    //   Buffer.from(signature),
    //   Buffer.from(expectedSignature)
    // );
    return true;
  }

  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/v1/currencies`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      
      return {
        name: this.name,
        status: response.ok ? 'healthy' : 'degraded',
        lastChecked: new Date().toISOString(),
        responseTime: response.ok ? 200 : 500,
      };
    } catch (error) {
      return {
        name: this.name,
        status: 'down',
        lastChecked: new Date().toISOString(),
        responseTime: 0,
      };
    }
  }
}

export const createGuardarianProvider = () => {
  return new GuardarianProvider({
    baseUrl: process.env.GUARDARIAN_API_BASE || 'https://api.guardarian.com',
    apiKey: process.env.GUARDARIAN_API_KEY || '',
    webhookSecret: process.env.GUARDARIAN_WEBHOOK_SECRET || '',
    enabled: process.env.GUARDARIAN_ENABLED !== 'false',
  });
};