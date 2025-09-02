// Wio Banking Provider Implementation
import type { BankingProvider, BankTransferParams, BankTransferResponse, Balance } from './index';

class WioProvider implements BankingProvider {
  name = 'wio';
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

  async getBalances(orgId: string): Promise<Balance[]> {
    if (!this.enabled) {
      throw new Error('Wio provider is disabled');
    }

    const response = await fetch(`${this.baseUrl}/api/v1/accounts/balances`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Organization-ID': orgId,
      },
    });

    if (!response.ok) {
      throw new Error(`Wio API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data.accounts.map((account: any) => ({
      currency: account.currency,
      available: parseFloat(account.available_balance),
      pending: parseFloat(account.pending_balance || '0'),
    }));
  }

  async createTransfer(params: BankTransferParams): Promise<BankTransferResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/transfers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'Organization-ID': params.organizationId,
      },
      body: JSON.stringify({
        amount: params.amount,
        currency: params.currency,
        beneficiary: {
          name: params.beneficiary.name,
          iban: params.beneficiary.iban,
          bank_name: params.beneficiary.bankName,
          swift_code: params.beneficiary.swiftCode,
        },
        purpose_code: params.purposeCode,
        reference: params.reference,
        payment_type: 'INSTANT', // or 'STANDARD'
      }),
    });

    if (!response.ok) {
      throw new Error(`Wio transfer error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      transferId: data.transfer_id,
      status: data.status,
      expectedCompletionDate: data.expected_completion_date,
      fees: parseFloat(data.fees),
    };
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // TODO: Implement Wio webhook signature verification
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
        responseTime: response.ok ? 120 : 500,
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

export const createWioProvider = () => {
  return new WioProvider({
    baseUrl: process.env.WIO_API_BASE || 'https://api.wio.me',
    apiKey: process.env.WIO_API_KEY || '',
    webhookSecret: process.env.WIO_WEBHOOK_SECRET || '',
    enabled: process.env.WIO_ENABLED !== 'false',
  });
};