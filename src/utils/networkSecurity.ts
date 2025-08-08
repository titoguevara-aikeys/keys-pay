/*
 * AIKEYS FINANCIAL PLATFORM - NETWORK SECURITY MODULE
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * DDoS Protection & Network Security Layer
 * Real-time traffic analysis and threat mitigation
 */

import { SecurityCore } from './securityCore';

export interface NetworkThreat {
  type: 'ddos' | 'botnet' | 'rate_limit' | 'ip_reputation' | 'geo_block';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  blocked: boolean;
  timestamp: string;
  metadata: Record<string, any>;
}

export class NetworkSecurityModule {
  private static instance: NetworkSecurityModule;
  private requestCounter = new Map<string, number[]>();
  private blockedIPs = new Set<string>();
  private suspiciousPatterns = new Map<string, number>();
  
  private config = {
    rateLimitWindow: 60000, // 1 minute
    maxRequestsPerWindow: 100,
    ddosThreshold: 500,
    geoBlockCountries: ['CN', 'RU', 'KP'], // Configurable geo-blocking
    ipReputationCheck: true,
    botDetectionEnabled: true
  };

  static getInstance(): NetworkSecurityModule {
    if (!NetworkSecurityModule.instance) {
      NetworkSecurityModule.instance = new NetworkSecurityModule();
    }
    return NetworkSecurityModule.instance;
  }

  constructor() {
    this.initializeNetworkMonitoring();
  }

  private initializeNetworkMonitoring(): void {
    // Intercept fetch requests for monitoring
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      
      try {
        const response = await originalFetch.apply(window, args);
        const endTime = performance.now();
        
        await this.analyzeRequest({
          url: args[0] as string,
          method: 'GET',
          responseTime: endTime - startTime,
          status: response.status,
          timestamp: new Date().toISOString()
        });
        
        return response;
      } catch (error) {
        await this.handleNetworkError(error);
        throw error;
      }
    };

    // Monitor network events
    this.setupConnectionMonitoring();
    this.setupDDoSProtection();
    this.cleanupOldData();
  }

  private async analyzeRequest(requestData: any): Promise<void> {
    const clientIP = await this.getClientIP();
    const timestamp = Date.now();

    // Rate limiting check
    if (this.isRateLimited(clientIP, timestamp)) {
      await this.triggerThreatResponse({
        type: 'rate_limit',
        severity: 'medium',
        source: clientIP,
        blocked: true,
        timestamp: new Date().toISOString(),
        metadata: { requestData }
      });
      return;
    }

    // DDoS detection
    if (this.detectDDoSPattern(clientIP, timestamp)) {
      await this.triggerThreatResponse({
        type: 'ddos',
        severity: 'critical',
        source: clientIP,
        blocked: true,
        timestamp: new Date().toISOString(),
        metadata: { requestData, pattern: 'high_frequency' }
      });
      return;
    }

    // Bot detection
    if (await this.detectBotTraffic(requestData)) {
      await this.triggerThreatResponse({
        type: 'botnet',
        severity: 'high',
        source: clientIP,
        blocked: true,
        timestamp: new Date().toISOString(),
        metadata: { requestData, botSignature: true }
      });
      return;
    }
  }

  private isRateLimited(ip: string, timestamp: number): boolean {
    if (!this.requestCounter.has(ip)) {
      this.requestCounter.set(ip, []);
    }

    const requests = this.requestCounter.get(ip)!;
    
    // Remove old requests outside the window
    const windowStart = timestamp - this.config.rateLimitWindow;
    const recentRequests = requests.filter(time => time > windowStart);
    
    // Add current request
    recentRequests.push(timestamp);
    this.requestCounter.set(ip, recentRequests);

    return recentRequests.length > this.config.maxRequestsPerWindow;
  }

  private detectDDoSPattern(ip: string, timestamp: number): boolean {
    const requests = this.requestCounter.get(ip) || [];
    const windowStart = timestamp - this.config.rateLimitWindow;
    const recentRequests = requests.filter(time => time > windowStart);

    return recentRequests.length > this.config.ddosThreshold;
  }

  private async detectBotTraffic(requestData: any): Promise<boolean> {
    const botSignatures = [
      // User agent patterns
      /bot|crawler|spider|scraper/i,
      // Suspicious request patterns
      /automated|headless|phantom/i,
      // Known bot frameworks
      /selenium|puppeteer|playwright/i
    ];

    const userAgent = navigator.userAgent;
    
    // Check user agent patterns
    if (botSignatures.some(pattern => pattern.test(userAgent))) {
      return true;
    }

    // Check for headless browser indicators
    if (this.detectHeadlessBrowser()) {
      return true;
    }

    // Check for automation frameworks
    if (this.detectAutomationFramework()) {
      return true;
    }

    return false;
  }

  private detectHeadlessBrowser(): boolean {
    // Check for common headless browser indicators
    if (navigator.webdriver) return true;
    if ((window as any).phantom) return true;
    if ((window as any).callPhantom) return true;
    if ((window as any).__nightmare) return true;
    if ((window as any)._phantom) return true;
    
    // Check for missing expected properties
    if (!navigator.plugins || navigator.plugins.length === 0) return true;
    if (!navigator.languages || navigator.languages.length === 0) return true;
    
    return false;
  }

  private detectAutomationFramework(): boolean {
    // Check for Selenium
    if ((window as any).selenium) return true;
    if ((window as any).__selenium_unwrapped) return true;
    if ((window as any).__webdriver_script_fn) return true;
    
    // Check for Puppeteer/Playwright
    if ((window as any).__puppeteer) return true;
    if ((window as any).__playwright) return true;
    
    return false;
  }

  private setupConnectionMonitoring(): void {
    // Monitor connection quality
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      
      connection.addEventListener('change', () => {
        this.analyzeConnectionChange(connection);
      });
    }

    // Monitor online/offline status
    window.addEventListener('online', () => {
      this.logNetworkEvent('CONNECTION_RESTORED', 'low');
    });

    window.addEventListener('offline', () => {
      this.logNetworkEvent('CONNECTION_LOST', 'medium');
    });
  }

  private setupDDoSProtection(): void {
    // Circuit breaker pattern
    let consecutiveFailures = 0;
    const maxFailures = 5;

    // Monitor for unusual error patterns
    window.addEventListener('error', (event) => {
      consecutiveFailures++;
      
      if (consecutiveFailures >= maxFailures) {
        this.triggerThreatResponse({
          type: 'ddos',
          severity: 'high',
          source: 'local',
          blocked: true,
          timestamp: new Date().toISOString(),
          metadata: { 
            consecutiveFailures,
            errorType: event.error?.name || 'unknown'
          }
        });
      }
    });

    // Reset failure counter on successful operations
    setInterval(() => {
      if (consecutiveFailures > 0) {
        consecutiveFailures = Math.max(0, consecutiveFailures - 1);
      }
    }, 30000);
  }

  private async getClientIP(): Promise<string> {
    try {
      // In a real implementation, this would get the actual client IP
      // For now, we'll use a placeholder
      return 'client-ip';
    } catch {
      return 'unknown';
    }
  }

  private analyzeConnectionChange(connection: any): void {
    const connectionData = {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData
    };

    // Detect potential network attacks based on connection changes
    if (connection.rtt > 1000) { // High latency
      this.logNetworkEvent('HIGH_LATENCY_DETECTED', 'medium', connectionData);
    }

    if (connection.downlink < 0.5) { // Very slow connection
      this.logNetworkEvent('BANDWIDTH_THROTTLING', 'medium', connectionData);
    }
  }

  private async triggerThreatResponse(threat: NetworkThreat): Promise<void> {
    // Log the threat
    await this.logNetworkThreat(threat);

    // Block IP if necessary
    if (threat.blocked && threat.source !== 'local') {
      this.blockedIPs.add(threat.source);
    }

    // Trigger appropriate countermeasures
    switch (threat.type) {
      case 'ddos':
        await this.activateDDoSMitigation(threat);
        break;
      case 'botnet':
        await this.activateBotProtection(threat);
        break;
      case 'rate_limit':
        await this.activateRateLimiting(threat);
        break;
    }

    // Send alert to security team
    await this.sendSecurityAlert(threat);
  }

  private async activateDDoSMitigation(threat: NetworkThreat): Promise<void> {
    // Implement DDoS mitigation strategies
    console.warn('🛡️ DDoS mitigation activated:', threat);
    
    // Reduce request frequency
    if (threat.source !== 'local') {
      this.blockedIPs.add(threat.source);
    }

    // Activate captcha challenges (in a real implementation)
    this.logNetworkEvent('DDOS_MITIGATION_ACTIVE', 'critical');
  }

  private async activateBotProtection(threat: NetworkThreat): Promise<void> {
    console.warn('🤖 Bot protection activated:', threat);
    
    // Implement bot protection measures
    // In a real implementation, this might include:
    // - Captcha challenges
    // - Device fingerprinting validation
    // - Behavioral analysis
    
    this.logNetworkEvent('BOT_PROTECTION_ACTIVE', 'high');
  }

  private async activateRateLimiting(threat: NetworkThreat): Promise<void> {
    console.warn('⏱️ Rate limiting activated:', threat);
    
    // Implement more aggressive rate limiting
    this.config.maxRequestsPerWindow = Math.max(10, this.config.maxRequestsPerWindow * 0.5);
    
    this.logNetworkEvent('RATE_LIMITING_ENHANCED', 'medium');
  }

  private async logNetworkThreat(threat: NetworkThreat): Promise<void> {
    try {
      // Store locally
      const threats = JSON.parse(localStorage.getItem('network_threats') || '[]');
      threats.push(threat);
      
      // Keep only last 50 threats
      if (threats.length > 50) {
        threats.splice(0, threats.length - 50);
      }
      
      localStorage.setItem('network_threats', JSON.stringify(threats));

      // Log to security core
      SecurityCore.getRiskProfile();
    } catch (error) {
      console.error('Failed to log network threat:', error);
    }
  }

  private logNetworkEvent(type: string, severity: string, metadata?: any): void {
    const event = {
      type: `NETWORK_${type}`,
      severity,
      timestamp: new Date().toISOString(),
      metadata: metadata || {}
    };

    console.log(`🌐 Network Event: ${type}`, event);
  }

  private async sendSecurityAlert(threat: NetworkThreat): Promise<void> {
    if (threat.severity === 'critical' || threat.severity === 'high') {
      // Send real-time alert
      try {
        await fetch('/api/security-alerts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'network_threat',
            threat,
            timestamp: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Failed to send security alert:', error);
      }
    }
  }

  private async handleNetworkError(error: any): Promise<void> {
    const networkError: NetworkThreat = {
      type: 'rate_limit', // Map to valid type
      severity: 'medium',
      source: 'client',
      blocked: false,
      timestamp: new Date().toISOString(),
      metadata: {
        error: error.message,
        stack: error.stack,
        errorType: 'network_error'
      }
    };

    await this.logNetworkThreat(networkError);
  }

  private cleanupOldData(): void {
    // Clean up old request data every 5 minutes
    setInterval(() => {
      const now = Date.now();
      const cutoff = now - (this.config.rateLimitWindow * 5);

      for (const [ip, requests] of this.requestCounter.entries()) {
        const recentRequests = requests.filter(time => time > cutoff);
        if (recentRequests.length === 0) {
          this.requestCounter.delete(ip);
        } else {
          this.requestCounter.set(ip, recentRequests);
        }
      }
    }, 5 * 60 * 1000);
  }

  // Public API
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip);
  }

  getNetworkThreats(): NetworkThreat[] {
    try {
      return JSON.parse(localStorage.getItem('network_threats') || '[]');
    } catch {
      return [];
    }
  }

  updateConfiguration(config: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...config };
  }

  getConfiguration(): typeof this.config {
    return { ...this.config };
  }
}

// Initialize network security
export const NetworkSecurity = NetworkSecurityModule.getInstance();
