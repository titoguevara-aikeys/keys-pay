// NymCard Provider Implementation
import type { CardProvider, CardIssueParams, CardIssueResponse, CardControls } from './index';

class NymCardProvider implements CardProvider {
  name = 'nymcard';
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

  async issueVirtualCard(params: CardIssueParams): Promise<CardIssueResponse> {
    if (!this.enabled) {
      throw new Error('NymCard provider is disabled');
    }

    const response = await fetch(`${this.baseUrl}/api/v1/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        user_id: params.userId,
        card_type: params.cardType,
        currency: params.currency,
        program_id: 'default',
      }),
    });

    if (!response.ok) {
      throw new Error(`NymCard API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      cardId: data.card_id,
      last4: data.last_four,
      status: data.status,
      expiryMonth: data.expiry_month,
      expiryYear: data.expiry_year,
    };
  }

  async updateControls(cardId: string, controls: CardControls): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/v1/cards/${cardId}/controls`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        spending_limits: controls.spendingLimits,
        restrictions: controls.restrictions,
      }),
    });

    if (!response.ok) {
      throw new Error(`NymCard controls update error: ${response.statusText}`);
    }
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // TODO: Implement webhook signature verification
    return true;
  }

  async getStatus() {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/health`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });
      
      return {
        name: this.name,
        status: response.ok ? 'healthy' : 'degraded',
        lastChecked: new Date().toISOString(),
        responseTime: response.ok ? 150 : 500,
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

export const createNymCardProvider = () => {
  return new NymCardProvider({
    baseUrl: process.env.NYMCARD_API_BASE || 'https://sandbox.nymcard.com',
    apiKey: process.env.NYMCARD_API_KEY || '',
    webhookSecret: process.env.NYMCARD_WEBHOOK_SECRET || '',
    enabled: process.env.NYMCARD_ENABLED !== 'false',
  });
};