// Keys Pay Provider Abstraction Layer
// Unified interface for all payment providers

export interface BaseProvider {
  name: string;
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
}

export interface CryptoProvider extends BaseProvider {
  createCheckout(params: CryptoCheckoutParams): Promise<CryptoCheckoutResponse>;
  verifyWebhook(payload: string, signature: string): Promise<boolean>;
}

export interface CardProvider extends BaseProvider {
  issueVirtualCard(params: CardIssueParams): Promise<CardIssueResponse>;
  updateControls(cardId: string, controls: CardControls): Promise<void>;
  verifyWebhook(payload: string, signature: string): Promise<boolean>;
}

export interface BankingProvider extends BaseProvider {
  getBalances(orgId: string): Promise<Balance[]>;
  createTransfer(params: BankTransferParams): Promise<BankTransferResponse>;
  verifyWebhook(payload: string, signature: string): Promise<boolean>;
}

// Common types
export interface CryptoCheckoutParams {
  userId: string;
  fiatAmount: number;
  fiatCurrency: string;
  cryptoCurrency: string;
  side: 'buy' | 'sell';
}

export interface CryptoCheckoutResponse {
  checkoutUrl: string;
  orderId: string;
  provider: string;
  expiresAt: string;
}

export interface CardIssueParams {
  userId: string;
  cardType: 'virtual' | 'physical';
  currency: string;
}

export interface CardIssueResponse {
  cardId: string;
  last4: string;
  status: string;
  expiryMonth: number;
  expiryYear: number;
}

export interface CardControls {
  spendingLimits: {
    daily?: number;
    monthly?: number;
    perTransaction?: number;
  };
  restrictions: {
    allowedMerchantCategories?: string[];
    blockedMerchantCategories?: string[];
    allowedCountries?: string[];
    blockedCountries?: string[];
  };
}

export interface BankTransferParams {
  organizationId: string;
  amount: number;
  currency: string;
  beneficiary: {
    name: string;
    iban: string;
    bankName: string;
    swiftCode?: string;
  };
  purposeCode?: string;
  reference?: string;
}

export interface BankTransferResponse {
  transferId: string;
  status: string;
  expectedCompletionDate: string;
  fees: number;
}

export interface Balance {
  currency: string;
  available: number;
  pending: number;
}

// Provider status
export interface ProviderStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: string;
  responseTime?: number;
  errorRate?: number;
}