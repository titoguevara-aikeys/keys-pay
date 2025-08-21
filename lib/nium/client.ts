import { v4 as uuidv4 } from 'uuid';

interface NiumConfig {
  apiKey?: string;
  clientHashId?: string;
  clientName?: string;
  env?: string;
}

interface RateLimiter {
  global: {
    requests: number;
    resetTime: number;
  };
  walletQueues: Map<string, {
    requests: number;
    resetTime: number;
  }>;
}

export class NiumClient {
  private config: Required<NiumConfig>;
  private rateLimiter: RateLimiter;

  constructor(config: NiumConfig = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.NIUM_API_KEY || '',
      clientHashId: config.clientHashId || process.env.NIUM_CLIENT_HASH_ID || '',
      clientName: config.clientName || process.env.NIUM_CLIENT_NAME || '',
      env: config.env || process.env.NIUM_ENV || 'sandbox'
    };

    this.rateLimiter = {
      global: { requests: 0, resetTime: Date.now() + 1000 },
      walletQueues: new Map()
    };

    if (!this.config.apiKey || !this.config.clientHashId) {
      throw new Error('NIUM API key and client hash ID are required');
    }
  }

  baseUrl(): string {
    return 'https://gateway.nium.com/api';
  }

  private headers(requestId?: string): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.config.apiKey,
      'x-client-name': this.config.clientName,
      'x-request-id': requestId || uuidv4()
    };
  }

  private async checkRateLimit(walletHashId?: string): Promise<void> {
    const now = Date.now();

    // Global rate limit: 20 rps
    if (now > this.rateLimiter.global.resetTime) {
      this.rateLimiter.global = { requests: 0, resetTime: now + 1000 };
    }
    if (this.rateLimiter.global.requests >= 20) {
      throw new Error('Rate limit exceeded: global 20 rps');
    }
    this.rateLimiter.global.requests++;

    // Wallet-specific rate limit: 3 rps for payouts
    if (walletHashId) {
      let walletLimit = this.rateLimiter.walletQueues.get(walletHashId);
      if (!walletLimit || now > walletLimit.resetTime) {
        walletLimit = { requests: 0, resetTime: now + 1000 };
        this.rateLimiter.walletQueues.set(walletHashId, walletLimit);
      }
      if (walletLimit.requests >= 3) {
        throw new Error(`Rate limit exceeded: wallet ${this.maskPii(walletHashId)} 3 rps`);
      }
      walletLimit.requests++;
    }
  }

  private maskPii(value: string): string {
    if (value.length <= 8) return '***';
    return value.slice(0, 4) + '***' + value.slice(-4);
  }

  private async makeRequest(
    method: 'GET' | 'POST',
    path: string,
    options: {
      body?: any;
      search?: URLSearchParams;
      walletHashId?: string;
      requestId?: string;
      retries?: number;
    } = {}
  ): Promise<any> {
    const { body, search, walletHashId, requestId, retries = 3 } = options;

    await this.checkRateLimit(walletHashId);

    const url = new URL(path, this.baseUrl());
    if (search) {
      url.search = search.toString();
    }

    const headers = this.headers(requestId);
    const config: RequestInit = {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) })
    };

    try {
      const response = await fetch(url.toString(), config);

      if (response.status === 429 && retries > 0) {
        // Exponential backoff on rate limit
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000));
        return this.makeRequest(method, path, { ...options, retries: retries - 1 });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`NIUM API error ${response.status}:`, this.maskPii(errorText));
        throw new Error(`NIUM API error: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      if (retries > 0 && (error instanceof TypeError || error.message.includes('fetch'))) {
        // Retry on network errors
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, 3 - retries) * 1000));
        return this.makeRequest(method, path, { ...options, retries: retries - 1 });
      }
      throw error;
    }
  }

  async get(path: string, search?: URLSearchParams, walletHashId?: string): Promise<any> {
    return this.makeRequest('GET', path, { search, walletHashId });
  }

  async post(path: string, body?: any, walletHashId?: string): Promise<any> {
    return this.makeRequest('POST', path, { body, walletHashId });
  }

  getConfig() {
    return {
      env: this.config.env,
      clientName: this.config.clientName,
      baseUrl: this.baseUrl(),
      clientHashId: this.maskPii(this.config.clientHashId)
    };
  }
}