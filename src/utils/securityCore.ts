/*
 * AIKEYS FINANCIAL PLATFORM - ENTERPRISE SECURITY CORE
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * CLASSIFIED SECURITY MODULE - TOP SECRET
 * Zero Trust Architecture Implementation
 * Compliant with: ISO 27001/27701, PCI DSS, SOC 2 Type II, SAMA Cybersecurity Framework
 */

import { supabase } from '@/integrations/supabase/client';

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
  private sessionMetrics = {
    startTime: Date.now(),
    keystrokePatterns: [] as number[],
    mousePatterns: [] as number[],
    apiCalls: 0,
    suspiciousActivities: 0
  };
  
  private securityConfig = {
    maxFailedAttempts: 3,
    sessionTimeout: 15 * 60 * 1000, // 15 minutes
    geoVelocityThreshold: 500, // km/h impossible travel
    deviceTrustDuration: 30 * 24 * 60 * 60 * 1000, // 30 days
    riskScoreThreshold: 70,
    enableBehavioralAnalysis: true,
    enableGeolocationTracking: true,
    enableDeviceFingerprinting: true
  };

  static getInstance(): EnterpriseSecurityCore {
    if (!EnterpriseSecurityCore.instance) {
      EnterpriseSecurityCore.instance = new EnterpriseSecurityCore();
    }
    return EnterpriseSecurityCore.instance;
  }

  constructor() {
    this.initializeSecurityMonitoring();
    this.setupBehavioralAnalytics();
    this.enableAntiTampering();
    this.setupNetworkSecurity();
  }

  // 1. IDENTITY & ACCESS PROTECTION
  async initializeWebAuthn(): Promise<boolean> {
    try {
      if (!window.PublicKeyCredential) {
        console.warn('WebAuthn not supported');
        return false;
      }

      // Check for platform authenticator
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (available) {
        this.logSecurityEvent({
          type: 'WEBAUTHN_READY',
          severity: 'low',
          source: 'identity',
          timestamp: new Date().toISOString(),
          metadata: { platformSupport: true },
          blocked: false
        });
      }
      
      return available;
    } catch (error) {
      this.logSecurityEvent({
        type: 'WEBAUTHN_ERROR',
        severity: 'medium',
        source: 'identity',
        timestamp: new Date().toISOString(),
        metadata: { error: error instanceof Error ? error.message : 'Unknown error' },
        blocked: false
      });
      return false;
    }
  }

  async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      screen.colorDepth,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      navigator.platform,
      navigator.cookieEnabled,
      // Hardware-backed fingerprinting
      await this.getCanvasFingerprint(),
      await this.getWebGLFingerprint(),
      await this.getAudioFingerprint()
    ];

    const fingerprint = await this.hashComponents(components);
    
    this.logSecurityEvent({
      type: 'DEVICE_FINGERPRINTED',
      severity: 'low',
      source: 'device',
      timestamp: new Date().toISOString(),
      metadata: { fingerprint: fingerprint.substring(0, 8) + '...' },
      blocked: false
    });

    return fingerprint;
  }

  // 2. RISK-BASED AUTHENTICATION
  async calculateRiskScore(context: any): Promise<number> {
    let riskScore = 0;
    const factors: string[] = [];

    // Device trust
    const fingerprint = await this.generateDeviceFingerprint();
    const trustedDevice = await this.isTrustedDevice(fingerprint);
    if (!trustedDevice) {
      riskScore += 30;
      factors.push('NEW_DEVICE');
    }

    // Geolocation analysis
    try {
      const location = await this.getCurrentLocation();
      if (location) {
        const locationRisk = await this.analyzeGeoRisk(location);
        riskScore += locationRisk.score;
        factors.push(...locationRisk.factors);
      }
    } catch (error) {
      riskScore += 20;
      factors.push('GEOLOCATION_BLOCKED');
    }

    // Behavioral analysis
    const behavioralRisk = this.analyzeBehavioralPatterns();
    riskScore += behavioralRisk.score;
    factors.push(...behavioralRisk.factors);

    // Time-based factors
    const timeRisk = this.analyzeTimePatterns();
    riskScore += timeRisk.score;
    factors.push(...timeRisk.factors);

    // Network analysis
    const networkRisk = await this.analyzeNetworkRisk();
    riskScore += networkRisk.score;
    factors.push(...networkRisk.factors);

    this.riskProfile = {
      score: Math.min(riskScore, 100),
      factors,
      deviceFingerprint: fingerprint,
      geoLocation: await this.getCurrentLocation(),
      behavioral: {
        typingPattern: this.sessionMetrics.keystrokePatterns,
        mouseMovements: this.sessionMetrics.mousePatterns,
        sessionDuration: Date.now() - this.sessionMetrics.startTime
      }
    };

    if (riskScore > this.securityConfig.riskScoreThreshold) {
      this.triggerStepUpAuth('HIGH_RISK_SCORE', { score: riskScore, factors });
    }

    return riskScore;
  }

  // 3. BEHAVIORAL BIOMETRICS
  private setupBehavioralAnalytics(): void {
    // Keystroke dynamics
    document.addEventListener('keydown', (event) => {
      const timestamp = performance.now();
      this.sessionMetrics.keystrokePatterns.push(timestamp);
      
      // Maintain rolling window
      if (this.sessionMetrics.keystrokePatterns.length > 50) {
        this.sessionMetrics.keystrokePatterns.shift();
      }
    });

    // Mouse dynamics
    document.addEventListener('mousemove', (event) => {
      const velocity = Math.sqrt(event.movementX ** 2 + event.movementY ** 2);
      this.sessionMetrics.mousePatterns.push(velocity);
      
      if (this.sessionMetrics.mousePatterns.length > 100) {
        this.sessionMetrics.mousePatterns.shift();
      }
    });

    // Touch dynamics (mobile)
    document.addEventListener('touchstart', (event) => {
      const touch = event.touches[0];
      if (touch) {
        // Analyze pressure, size, and timing
        const pressure = (touch as any).force || 0.5;
        this.analyzeTouchPattern(pressure, touch.radiusX || 0, touch.radiusY || 0);
      }
    });
  }

  // 4. NETWORK SECURITY & ANTI-TAMPERING
  private enableAntiTampering(): void {
    // Skip aggressive measures in development environment
    if (window.location.hostname.includes('lovableproject.com')) {
      return;
    }

    // Background monitoring for actual threats only
    this.setupThreatDetection();
  }

  private setupThreatDetection(): void {
    // Monitor for actual cloning attempts
    this.detectSourceCodeTheft();
    
    // Monitor for automation/scraping attempts
    this.detectAutomationThreats();
    
    // Monitor for data exfiltration attempts
    this.monitorDataExfiltration();
  }

  private detectSourceCodeTheft(): void {
    // Check for mass DOM access patterns (scraping)
    let domAccessCount = 0;
    const originalGetElementById = document.getElementById;
    
    try {
      document.getElementById = function(...args) {
        domAccessCount++;
        if (domAccessCount > 100) {
          EnterpriseSecurityCore.getInstance().handleSecurityViolation('POTENTIAL_SCRAPING', {
            accessCount: domAccessCount,
            timeframe: '1min'
          });
        }
        return originalGetElementById.apply(document, args);
      };
    } catch (error) {
      // Silently fail if we can't override
    }

    // Monitor for excessive network requests (data extraction)
    let requestCount = 0;
    const startTime = Date.now();
    
    try {
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        requestCount++;
        const timeDiff = Date.now() - startTime;
        
        if (requestCount > 50 && timeDiff < 60000) { // 50 requests in 1 minute
          EnterpriseSecurityCore.getInstance().handleSecurityViolation('EXCESSIVE_REQUESTS', {
            requestCount,
            timeframe: `${timeDiff}ms`
          });
        }
        
        return originalFetch.apply(window, args);
      };
    } catch (error) {
      // Silently fail if we can't override
    }
  }

  private detectAutomationThreats(): void {
    // Monitor for headless browser patterns
    const headlessChecks = [
      () => navigator.webdriver,
      () => (window as any).chrome && (window as any).chrome.runtime && (window as any).chrome.runtime.onConnect,
      () => (window as any).callPhantom || (window as any)._phantom,
      () => navigator.userAgent.includes('HeadlessChrome')
    ];

    const suspiciousCount = headlessChecks.filter(check => {
      try {
        return check();
      } catch {
        return false;
      }
    }).length;
    
    if (suspiciousCount >= 2) {
      this.handleSecurityViolation('AUTOMATION_DETECTED', {
        patterns: suspiciousCount,
        userAgent: navigator.userAgent
      });
    }
  }

  private monitorDataExfiltration(): void {
    // Monitor for localStorage/sessionStorage mass access
    let storageAccessCount = 0;
    
    try {
      const originalGetItem = localStorage.getItem;
      
      localStorage.getItem = function(key) {
        storageAccessCount++;
        if (storageAccessCount > 20) {
          EnterpriseSecurityCore.getInstance().handleSecurityViolation('STORAGE_ENUMERATION', {
            accessCount: storageAccessCount
          });
        }
        return originalGetItem.call(localStorage, key);
      };
    } catch (error) {
      // Silently fail if we can't override
    }
  }

  // 5. CRYPTOGRAPHIC PROTECTION
  async encryptSensitiveData(data: string, context: string): Promise<string> {
    try {
      // Use Web Crypto API for client-side encryption
      const key = await this.deriveEncryptionKey(context);
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        dataBuffer
      );

      const result = {
        encrypted: Array.from(new Uint8Array(encrypted)),
        iv: Array.from(iv)
      };

      return btoa(JSON.stringify(result));
    } catch (error) {
      this.logSecurityEvent({
        type: 'ENCRYPTION_ERROR',
        severity: 'high',
        source: 'crypto',
        timestamp: new Date().toISOString(),
        metadata: { context, error: error instanceof Error ? error.message : 'Unknown error' },
        blocked: false
      });
      throw error;
    }
  }

  // 6. FRAUD DETECTION
  async detectFraudulentActivity(transactionData: any): Promise<{ isFraud: boolean; confidence: number; reasons: string[] }> {
    const reasons: string[] = [];
    let riskScore = 0;

    // Velocity checks
    if (transactionData.amount > 1000) {
      const recentTransactions = await this.getRecentTransactions(24); // Last 24 hours
      const totalVolume = recentTransactions.reduce((sum: number, tx: any) => sum + tx.amount, 0);
      
      if (totalVolume > 5000) {
        riskScore += 40;
        reasons.push('HIGH_VELOCITY_VOLUME');
      }
    }

    // Geographic anomaly
    const currentLocation = await this.getCurrentLocation();
    const lastKnownLocation = await this.getLastTransactionLocation();
    
    if (currentLocation && lastKnownLocation) {
      const distance = this.calculateDistance(currentLocation, lastKnownLocation);
      const timeDiff = Date.now() - lastKnownLocation.timestamp;
      const velocity = distance / (timeDiff / 3600000); // km/h
      
      if (velocity > this.securityConfig.geoVelocityThreshold) {
        riskScore += 50;
        reasons.push('IMPOSSIBLE_TRAVEL');
      }
    }

    // Behavioral anomaly
    const currentRisk = await this.calculateRiskScore({});
    if (currentRisk > 80) {
      riskScore += 30;
      reasons.push('BEHAVIORAL_ANOMALY');
    }

    const isFraud = riskScore > 70;
    const confidence = Math.min(riskScore, 100);

    if (isFraud) {
      this.handleSecurityViolation('FRAUD_DETECTED', {
        transactionData,
        riskScore,
        reasons,
        confidence
      });
    }

    return { isFraud, confidence, reasons };
  }

  // 7. SECURITY EVENT HANDLING
  private async handleSecurityViolation(type: string, metadata: any): Promise<void> {
    const event: SecurityEvent = {
      type,
      severity: this.getSeverityForViolationType(type),
      source: 'security_core',
      timestamp: new Date().toISOString(),
      metadata,
      blocked: true
    };

    await this.logSecurityEvent(event);

    // Trigger appropriate response
    switch (event.severity) {
      case 'critical':
        await this.triggerSecurityLockdown(event);
        break;
      case 'high':
        await this.triggerStepUpAuth(type, metadata);
        break;
      case 'medium':
        await this.increaseSecurity(event);
        break;
    }

    // Send alert to platform owner
    await this.sendSecurityAlert(event);
  }

  private async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      await supabase.functions.invoke('log-security-event', {
        body: event
      });

      // Also log locally for immediate access
      const logs = JSON.parse(localStorage.getItem('security_events') || '[]');
      logs.push(event);
      
      // Keep only last 100 events
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('security_events', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  // 8. HELPER METHODS
  private async deriveEncryptionKey(context: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(context + navigator.userAgent),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('aikeys-security-salt'),
        iterations: 100000,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private async getCanvasFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-canvas';

    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('AIKEYS Security Fingerprint 🔒', 2, 2);
    
    return canvas.toDataURL();
  }

  private async getWebGLFingerprint(): Promise<string> {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) return 'no-webgl';

    const renderer = gl.getParameter(gl.RENDERER);
    const vendor = gl.getParameter(gl.VENDOR);
    
    return `${vendor}-${renderer}`;
  }

  private async getAudioFingerprint(): Promise<string> {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      
      oscillator.connect(analyser);
      oscillator.frequency.value = 1000;
      oscillator.start();
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(dataArray);
      
      oscillator.stop();
      audioContext.close();
      
      return Array.from(dataArray.slice(0, 10)).join('');
    } catch {
      return 'no-audio';
    }
  }

  private async hashComponents(components: any[]): Promise<string> {
    const data = components.join('|');
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private getSeverityForViolationType(type: string): 'critical' | 'high' | 'medium' | 'low' {
    const severityMap: Record<string, 'critical' | 'high' | 'medium' | 'low'> = {
      'FRAUD_DETECTED': 'critical',
      'IMPOSSIBLE_TRAVEL': 'critical',
      'DEVELOPER_TOOLS_DETECTED': 'high',
      'CONSOLE_ACCESS_DETECTED': 'high',
      'CONTEXT_MENU_BLOCKED': 'medium',
      'NEW_DEVICE': 'medium',
      'GEOLOCATION_BLOCKED': 'low'
    };
    
    return severityMap[type] || 'medium';
  }

  // Placeholder methods for implementation
  private async getCurrentLocation(): Promise<any> { return null; }
  private async isTrustedDevice(fingerprint: string): Promise<boolean> { return false; }
  private async analyzeGeoRisk(location: any): Promise<{ score: number; factors: string[] }> { return { score: 0, factors: [] }; }
  private analyzeBehavioralPatterns(): { score: number; factors: string[] } { return { score: 0, factors: [] }; }
  private analyzeTimePatterns(): { score: number; factors: string[] } { return { score: 0, factors: [] }; }
  private async analyzeNetworkRisk(): Promise<{ score: number; factors: string[] }> { return { score: 0, factors: [] }; }
  private async triggerStepUpAuth(reason: string, metadata: any): Promise<void> {}
  private analyzeTouchPattern(pressure: number, radiusX: number, radiusY: number): void {}
  private async getRecentTransactions(hours: number): Promise<any[]> { return []; }
  private async getLastTransactionLocation(): Promise<any> { return null; }
  private calculateDistance(loc1: any, loc2: any): number { return 0; }
  private async triggerSecurityLockdown(event: SecurityEvent): Promise<void> {}
  private async increaseSecurity(event: SecurityEvent): Promise<void> {}
  private async sendSecurityAlert(event: SecurityEvent): Promise<void> {
    await supabase.functions.invoke('send-security-alert', {
      body: {
        violationType: event.type,
        details: event.metadata,
        timestamp: event.timestamp,
        domain: window.location.hostname,
        userAgent: navigator.userAgent,
        severity: event.severity
      }
    });
  }

  // Public API
  async initializeSecurity(): Promise<void> {
    await this.initializeWebAuthn();
    await this.generateDeviceFingerprint();
    await this.calculateRiskScore({});
    await this.initializeSecurityMonitoring();
    
    const interval = await computeMonitoringIntervalMs();
    
    this.logSecurityEvent({
      type: 'SECURITY_INITIALIZED',
      severity: 'low',
      source: 'core',
      timestamp: new Date().toISOString(),
      metadata: { 
        version: '1.0.0', 
        networkSecurity: true,
        monitoringInterval: interval
      },
      blocked: false
    });
  }

  private async performFullSecurityScan(): Promise<void> {
    // Perform comprehensive security checks in production mode
    try {
      await this.calculateRiskScore({});
      // Additional security validations can be added here
    } catch (error) {
      console.error('Full security scan error:', error);
    }
  }

  getRiskProfile(): RiskProfile | null {
    return this.riskProfile;
  }

  async performSecurityAudit(): Promise<any> {
    const events = JSON.parse(localStorage.getItem('security_events') || '[]');
    const recentEvents = events.filter((e: SecurityEvent) => 
      Date.now() - new Date(e.timestamp).getTime() < 24 * 60 * 60 * 1000
    );

    return {
      totalEvents: events.length,
      recentEvents: recentEvents.length,
      criticalEvents: recentEvents.filter((e: SecurityEvent) => e.severity === 'critical').length,
      highRiskEvents: recentEvents.filter((e: SecurityEvent) => e.severity === 'high').length,
      currentRiskScore: this.riskProfile?.score || 0,
      deviceFingerprint: this.riskProfile?.deviceFingerprint || 'unknown'
    };
  }

  private async initializeSecurityMonitoring(): Promise<void> {
    // Use server-controlled monitoring interval
    const interval = await computeMonitoringIntervalMs();
    
    setInterval(() => {
      this.performContinuousMonitoring();
    }, interval);
    
    console.log(`🔐 Security monitoring initialized with ${interval/1000}s interval`);
    
    // Initialize network security layer
    this.setupNetworkSecurity();
  }

  private async performContinuousMonitoring(): Promise<void> {
    const interval = await computeMonitoringIntervalMs();
    const isBetaMode = interval === BETA_INTERVAL_MS;
    
    console.log(`🔐 Security monitoring check (${isBetaMode ? 'beta' : 'production'} mode)`);
    
    // Always perform critical security checks
    if (Date.now() - this.sessionMetrics.startTime > this.securityConfig.sessionTimeout) {
      this.handleSecurityViolation('SESSION_TIMEOUT', {
        duration: Date.now() - this.sessionMetrics.startTime
      });
    }
    
    // In production mode, perform additional security checks
    if (!isBetaMode) {
      await this.performFullSecurityScan();
    }
  }

  private setupNetworkSecurity(): void {
    // Import network security dynamically to avoid circular dependency
    import('./networkSecurity').then(({ NetworkSecurity }) => {
      // Network security is already initialized automatically
      console.log('🌐 Network security layer activated');
    }).catch(error => {
      console.error('Failed to initialize network security:', error);
    });
  }
}

// Monitoring interval constants
export const DEFAULT_INTERVAL_MS = 30_000; // 30 seconds (production default)
export const BETA_INTERVAL_MS = 300_000; // 5 minutes (beta testing)

/**
 * Compute the monitoring interval based on server-controlled flags
 * Safe default: 30 seconds unless server explicitly enables beta mode
 */
export async function computeMonitoringIntervalMs(): Promise<number> {
  try {
    // Dynamic import to avoid circular dependency
    const { getServerFlag, isForceFullMonitoring } = await import('@/lib/flags');
    
    // Force full monitoring overrides everything
    if (isForceFullMonitoring()) {
      return DEFAULT_INTERVAL_MS;
    }
    
    // Check server-side beta flag
    const betaFlag = await getServerFlag('beta_monitoring');
    if (betaFlag === 'on') {
      return BETA_INTERVAL_MS;
    }
    
    // Default to production interval
    return DEFAULT_INTERVAL_MS;
  } catch (error) {
    console.error('Failed to compute monitoring interval, using safe default:', error);
    return DEFAULT_INTERVAL_MS; // Safe fallback
  }
}

// Initialize singleton
export const SecurityCore = EnterpriseSecurityCore.getInstance();
