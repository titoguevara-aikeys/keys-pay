import { logger } from '../logger';

export interface OpenPaydConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  webhookSecret: string;
}

export interface IBANApplicationRequest {
  clientId: string;
  accountName: string;
  currency: string;
  country: string;
  businessDetails?: {
    companyName: string;
    registrationNumber: string;
    businessType: string;
  };
  metadata?: Record<string, any>;
}

export interface IBANApplicationResponse {
  applicationId: string;
  provider: 'OPENPAYD';
  status: 'pending' | 'approved' | 'rejected';
  nextActionUrl?: string;
  estimatedCompletionDays: number;
}

export interface IBANAccountDetails {
  id: string;
  iban: string;
  ibanMasked: string;
  accountNumber: string;
  sortCode: string;
  currency: string;
  status: 'active' | 'suspended' | 'closed';
  balance: number;
  availableBalance: number;
  provider: 'OPENPAYD';
}

export interface OpenPaydWebhookEvent {
  eventType: string;
  timestamp: string;
  data: {
    applicationId?: string;
    accountId?: string;
    transactionId?: string;
    status: string;
    amount?: number;
    currency?: string;
    reference?: string;
  };
}

export class OpenPaydProvider {
  private config: OpenPaydConfig;
  private mockMode: boolean;

  constructor(config: OpenPaydConfig, mockMode = false) {
    this.config = config;
    this.mockMode = mockMode;
  }

  async applyForIBAN(request: IBANApplicationRequest): Promise<IBANApplicationResponse> {
    const log = logger.child({ provider: 'openpayd', method: 'applyForIBAN' });

    if (this.mockMode) {
      log.info('Creating mock OpenPayd IBAN application');
      const applicationId = `opd_app_mock_${Date.now()}`;
      return {
        applicationId,
        provider: 'OPENPAYD',
        status: 'pending',
        nextActionUrl: `${this.config.baseUrl}/kyb/complete/${applicationId}`,
        estimatedCompletionDays: 3
      };
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/v1/accounts/applications`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'X-API-Secret': this.config.apiSecret
        },
        body: JSON.stringify({
          clientReference: request.clientId,
          accountName: request.accountName,
          currency: request.currency,
          country: request.country,
          businessInformation: request.businessDetails,
          ...request.metadata
        })
      });

      if (!response.ok) {
        throw new Error(`OpenPayd application error: ${response.status}`);
      }

      const data = await response.json();
      
      log.info({ applicationId: data.applicationId }, 'Created OpenPayd IBAN application');

      return {
        applicationId: data.applicationId,
        provider: 'OPENPAYD',
        status: this.mapApplicationStatus(data.status),
        nextActionUrl: data.kybUrl,
        estimatedCompletionDays: data.estimatedDays || 5
      };
    } catch (error) {
      log.error({ error }, 'Failed to create OpenPayd IBAN application');
      throw new Error('Failed to create IBAN application');
    }
  }

  async getAccountDetails(accountId: string): Promise<IBANAccountDetails> {
    const log = logger.child({ provider: 'openpayd', method: 'getAccountDetails' });

    if (this.mockMode) {
      log.info({ accountId }, 'Getting mock OpenPayd account details');
      return {
        id: accountId,
        iban: 'GB29 NWBK 6016 1331 9268 19',
        ibanMasked: 'GB29 **** **** **** 68 19',
        accountNumber: '13319268',
        sortCode: '601613',
        currency: 'GBP',
        status: 'active',
        balance: 1000.00,
        availableBalance: 950.00,
        provider: 'OPENPAYD'
      };
    }

    try {
      const response = await fetch(`${this.config.baseUrl}/v1/accounts/${accountId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-API-Secret': this.config.apiSecret
        }
      });

      if (!response.ok) {
        throw new Error(`OpenPayd account error: ${response.status}`);
      }

      const data = await response.json();
      
      log.info({ accountId }, 'Retrieved OpenPayd account details');

      return {
        id: data.accountId,
        iban: data.iban,
        ibanMasked: this.maskIBAN(data.iban),
        accountNumber: data.accountNumber,
        sortCode: data.sortCode,
        currency: data.currency,
        status: this.mapAccountStatus(data.status),
        balance: data.balance,
        availableBalance: data.availableBalance,
        provider: 'OPENPAYD'
      };
    } catch (error) {
      log.error({ error, accountId }, 'Failed to get OpenPayd account details');
      throw new Error('Failed to get account details');
    }
  }

  private maskIBAN(iban: string): string {
    if (iban.length < 8) return iban;
    const cleanIban = iban.replace(/\s/g, '');
    const masked = cleanIban.slice(0, 4) + ' **** **** **** ' + cleanIban.slice(-5);
    return masked;
  }

  private mapApplicationStatus(opStatus: string): 'pending' | 'approved' | 'rejected' {
    const statusMap: Record<string, 'pending' | 'approved' | 'rejected'> = {
      'PENDING_REVIEW': 'pending',
      'UNDER_REVIEW': 'pending',
      'APPROVED': 'approved',
      'REJECTED': 'rejected',
      'DECLINED': 'rejected'
    };

    return statusMap[opStatus] || 'pending';
  }

  private mapAccountStatus(opStatus: string): 'active' | 'suspended' | 'closed' {
    const statusMap: Record<string, 'active' | 'suspended' | 'closed'> = {
      'ACTIVE': 'active',
      'LIVE': 'active',
      'SUSPENDED': 'suspended',
      'BLOCKED': 'suspended',
      'CLOSED': 'closed',
      'TERMINATED': 'closed'
    };

    return statusMap[opStatus] || 'suspended';
  }

  async verifyWebhook(payload: string, signature: string): Promise<boolean> {
    // Implement OpenPayd webhook signature verification
    return true;
  }

  parseWebhookEvent(payload: string): OpenPaydWebhookEvent {
    return JSON.parse(payload);
  }
}

export const createOpenPaydProvider = (mockMode = process.env.NODE_ENV === 'development') => {
  const config: OpenPaydConfig = {
    apiKey: process.env.OPENPAYD_API_KEY || '',
    apiSecret: process.env.OPENPAYD_API_SECRET || '',
    baseUrl: process.env.OPENPAYD_BASE_URL || 'https://api.openpayd.com',
    webhookSecret: process.env.OPENPAYD_WEBHOOK_SECRET || ''
  };

  return new OpenPaydProvider(config, mockMode);
};