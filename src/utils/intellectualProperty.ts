/*
 * AIKEYS FINANCIAL PLATFORM
 * Copyright (c) 2025 AIKEYS Financial Technologies
 * All Rights Reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * 
 * This software contains proprietary and confidential information of
 * AIKEYS Financial Technologies. The software and its documentation are
 * protected by copyright law and international copyright treaties.
 * 
 * Unauthorized reproduction or distribution of this program, or any portion
 * of it, may result in severe civil and criminal penalties, and will be
 * prosecuted to the maximum extent possible under law.
 * 
 * INTELLECTUAL PROPERTY RIGHTS NOTICE:
 * This platform and all its components are protected under:
 * - Copyright Law
 * - Trade Secret Law  
 * - Patent Applications (Pending)
 * - International IP Treaties
 * 
 * Reverse engineering, decompilation, disassembly, or any form of
 * unauthorized access is strictly prohibited and constitutes a
 * violation of intellectual property rights.
 * 
 * For licensing inquiries: legal@aikeys.ai
 * 
 * Platform Version: 1.0.0
 * Build Date: 2025-08-08
 * License: Proprietary
 */

export interface CopyrightInfo {
  year: number;
  company: string;
  platform: string;
  version: string;
  buildDate: string;
}

export class IntellectualPropertyProtection {
  private static readonly COPYRIGHT_INFO: CopyrightInfo = {
    year: 2025,
    company: 'AIKEYS Financial Technologies',
    platform: 'AIKEYS Financial Platform',
    version: '1.0.0',
    buildDate: '2025-08-08'
  };

  // Generate copyright notice
  static getCopyrightNotice(): string {
    const { year, company, platform } = this.COPYRIGHT_INFO;
    return `© ${year} ${company}. ${platform} - All Rights Reserved.`;
  }

  // Generate full IP notice
  static getIPNotice(): string {
    return `
      PROPRIETARY SOFTWARE - UNAUTHORIZED USE PROHIBITED
      Protected by Copyright, Trade Secret, and Patent Law
      Reverse Engineering Strictly Forbidden
      Violations Subject to Legal Action
    `.trim();
  }

  // Obfuscated contact information (only visible during violations)
  static getViolationContact(): string {
    // Base64 encoded contact info - only decoded during security violations
    const encoded = 'VGhpcyBzb2Z0d2FyZSBpcyBwcm90ZWN0ZWQgYnkgaW50ZWxsZWN0dWFsIHByb3BlcnR5IGxhd3MuIFVuYXV0aG9yaXplZCBhY2Nlc3MgZGV0ZWN0ZWQuIENvbnRhY3Q6IHRpdG8uZ3VldmFyYUBhaWtleXMuYWkgb3IgdGl0by5ndWV2YXJhQGdtYWlsLmNvbSBmb3IgbGljZW5zaW5nLg==';
    return atob(encoded);
  }

  // Anti-tampering checksum
  static generatePlatformChecksum(): string {
    const platformData = JSON.stringify({
      name: this.COPYRIGHT_INFO.platform,
      version: this.COPYRIGHT_INFO.version,
      domain: window.location.hostname,
      timestamp: Date.now()
    });
    
    // Simple checksum for platform integrity
    let hash = 0;
    for (let i = 0; i < platformData.length; i++) {
      const char = platformData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  // Log IP violation
  static logIPViolation(violationType: string, details: any): void {
    const violation = {
      type: 'INTELLECTUAL_PROPERTY_VIOLATION',
      subtype: violationType,
      timestamp: new Date().toISOString(),
      platform: this.COPYRIGHT_INFO.platform,
      version: this.COPYRIGHT_INFO.version,
      domain: window.location.hostname,
      userAgent: navigator.userAgent,
      details: details,
      checksum: this.generatePlatformChecksum()
    };

    // Log to console with copyright notice
    console.error('🚨 INTELLECTUAL PROPERTY VIOLATION DETECTED 🚨');
    console.error(this.getCopyrightNotice());
    console.error(this.getIPNotice());
    console.error('Violation Details:', violation);
    
    // In production, this would send to security monitoring
    if (process.env.NODE_ENV === 'production') {
      // Send violation report to secure endpoint
      this.reportViolation(violation);
    }
  }

  private static async reportViolation(violation: any): Promise<void> {
    try {
      await fetch('/api/security/ip-violation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Platform-Checksum': this.generatePlatformChecksum()
        },
        body: JSON.stringify(violation)
      });
    } catch (error) {
      console.error('Failed to report IP violation:', error);
    }
  }

  // Initialize IP protection
  static initializeProtection(): void {
    // Add copyright to document
    const copyrightMeta = document.createElement('meta');
    copyrightMeta.name = 'copyright';
    copyrightMeta.content = this.getCopyrightNotice();
    document.head.appendChild(copyrightMeta);

    // Add IP protection meta
    const ipMeta = document.createElement('meta');
    ipMeta.name = 'intellectual-property';
    ipMeta.content = 'Protected by copyright and trade secret law. Unauthorized use prohibited.';
    document.head.appendChild(ipMeta);

    // Monitor for developer tools
    this.setupDeveloperToolsDetection();
    
    // Setup code integrity monitoring
    this.setupIntegrityMonitoring();
  }

  private static setupDeveloperToolsDetection(): void {
    // Detect DevTools opening
    let devtools = { open: false, orientation: '' };
    
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > 160 || 
          window.outerWidth - window.innerWidth > 160) {
        if (!devtools.open) {
          devtools.open = true;
          this.logIPViolation('DEVELOPER_TOOLS_DETECTED', {
            action: 'DevTools opened',
            windowDimensions: {
              outer: { width: window.outerWidth, height: window.outerHeight },
              inner: { width: window.innerWidth, height: window.innerHeight }
            }
          });
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  private static setupIntegrityMonitoring(): void {
    // Monitor for code modification attempts
    const originalConsole = { ...console };
    
    // Protect against console manipulation
    Object.keys(console).forEach(key => {
      const original = console[key as keyof Console];
      if (typeof original === 'function') {
        (console as any)[key] = function(...args: any[]) {
          if (args.some(arg => typeof arg === 'string' && arg.includes('AIKEYS'))) {
            IntellectualPropertyProtection.logIPViolation('CONSOLE_TAMPERING', {
              method: key,
              arguments: args
            });
          }
          return (original as any).apply(console, args);
        };
      }
    });
  }
}

// Auto-initialize IP protection
if (typeof window !== 'undefined') {
  IntellectualPropertyProtection.initializeProtection();
}