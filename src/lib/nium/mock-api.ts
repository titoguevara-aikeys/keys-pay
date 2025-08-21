// Mock NIUM API for development/testing when actual API routes are not available

export class MockNiumAPI {
  private delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  async health() {
    await this.delay(500);
    return {
      ok: true,
      env: "sandbox",
      baseUrl: "https://gateway.nium.com/api",
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };
  }

  async createBeneficiary(data: any) {
    await this.delay(1000);
    
    if (!data.customerHashId || !data.beneficiaryDetail?.firstName) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields'
      };
    }

    return {
      ok: true,
      beneficiaryId: crypto.randomUUID(),
      data: {
        beneficiaryHashId: crypto.randomUUID(),
        firstName: data.beneficiaryDetail.firstName,
        lastName: data.beneficiaryDetail.lastName,
        status: 'active'
      }
    };
  }

  async getQuote(params: any) {
    await this.delay(800);
    
    if (!params.customerHashId || !params.walletHashId) {
      return {
        ok: false,
        code: 'INVALID_PARAMS',
        message: 'Missing required parameters'
      };
    }

    return {
      ok: true,
      auditId: `audit_${Date.now()}`,
      rate: 3.67,
      holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      data: {
        exchangeRate: 3.67,
        sourceCurrency: params.sourceCurrency,
        destinationCurrency: params.destinationCurrency
      }
    };
  }

  async executeTransfer(data: any) {
    await this.delay(1500);
    
    if (!data.auditId || !data.customerHashId || !data.walletHashId) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields'
      };
    }

    return {
      ok: true,
      systemReferenceNumber: `SYS${Date.now()}`,
      status: 'INITIATED',
      data: {
        amount: data.amount,
        currency: data.currency,
        createdAt: new Date().toISOString()
      }
    };
  }

  async getStatus(params: any) {
    await this.delay(300);
    
    if (!params.systemReferenceNumber) {
      return {
        ok: false,
        message: 'Missing system reference number'
      };
    }

    // Simulate status progression
    const statuses = ['INITIATED', 'PROCESSING', 'PAID'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      ok: true,
      status: randomStatus,
      systemReferenceNumber: params.systemReferenceNumber,
      data: {
        lastUpdated: new Date().toISOString(),
        statusHistory: [
          { status: 'INITIATED', timestamp: new Date(Date.now() - 2000).toISOString() },
          { status: randomStatus, timestamp: new Date().toISOString() }
        ]
      }
    };
  }

  async issueVirtualAccount(data: any) {
    await this.delay(1200);
    
    if (!data.customerHashId || !data.walletHashId) {
      return {
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Missing required fields'
      };
    }

    return {
      ok: true,
      accountNumber: `VA${Math.random().toString().slice(2, 18)}`,
      routingCode: "ADCBAEAA",
      iban: `AE${Math.random().toString().slice(2, 20).padStart(18, '0')}`,
      currency: data.currency || 'AED',
      data: {
        status: 'active',
        createdAt: new Date().toISOString()
      }
    };
  }
}