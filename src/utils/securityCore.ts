/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY CORE (DEVELOPMENT MODE)
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * ALL SECURITY FEATURES DISABLED FOR DEVELOPMENT
 */

// Legacy exports for tests (disabled)
export const DEFAULT_INTERVAL_MS = 30000;
export const BETA_INTERVAL_MS = 300000;

export async function computeMonitoringIntervalMs(): Promise<number> {
  return 30000; // Fixed value for development
}

export interface SecurityEvent {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  timestamp: string;
  metadata: Record<string, any>;
  blocked: boolean;
}

export interface RiskProfile {
  score: number;
  factors: string[];
  deviceFingerprint: string;
  geoLocation?: {
    country: string;
    region: string;
    city: string;
    lat: number;
    lng: number;
  };
  behavioral: {
    typingPattern: number[];
    mouseMovements: number[];
    sessionDuration: number;
  };
}

export class EnterpriseSecurityCore {
  private static instance: EnterpriseSecurityCore;
  private riskProfile: RiskProfile | null = null;

  static getInstance(): EnterpriseSecurityCore {
    if (!EnterpriseSecurityCore.instance) {
      EnterpriseSecurityCore.instance = new EnterpriseSecurityCore();
    }
    return EnterpriseSecurityCore.instance;
  }

  constructor() {
    // ALL SECURITY DISABLED FOR DEVELOPMENT
    console.log('🔓 SecurityCore initialized with all features disabled for development');
  }

  // All methods disabled for development - return safe defaults
  async initializeSecurity(): Promise<void> {
    console.log('🔓 Security initialization disabled for development');
  }

  getRiskProfile(): RiskProfile | null {
    return {
      score: 0,
      factors: [],
      deviceFingerprint: 'dev-mode',
      behavioral: {
        typingPattern: [],
        mouseMovements: [],
        sessionDuration: 0
      }
    };
  }

  async performSecurityAudit(): Promise<any> {
    return {
      totalEvents: 0,
      recentEvents: 0,
      criticalEvents: 0,
      highRiskEvents: 0,
      currentRiskScore: 0,
      deviceFingerprint: 'dev-mode'
    };
  }

  async calculateRiskScore(context: any): Promise<number> {
    return 0;
  }

  async initializeWebAuthn(): Promise<boolean> {
    return false;
  }

  async generateDeviceFingerprint(): Promise<string> {
    return 'dev-mode';
  }

  async encryptSensitiveData(data: string, context: string): Promise<string> {
    return btoa(data); // Simple base64 for dev
  }

  async detectFraudulentActivity(transactionData: any): Promise<{ isFraud: boolean; confidence: number; reasons: string[] }> {
    return { isFraud: false, confidence: 0, reasons: [] };
  }
}

// Initialize singleton
export const SecurityCore = EnterpriseSecurityCore.getInstance();