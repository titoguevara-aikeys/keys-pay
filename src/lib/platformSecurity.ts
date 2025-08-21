/*
 * AIKEYS FINANCIAL PLATFORM - ADVANCED SECURITY MODULE
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * ENTERPRISE SECURITY & ANTI-TAMPERING SYSTEM
 * Protects platform integrity and prevents unauthorized access
 */

export class PlatformSecurity {
  private static instance: PlatformSecurity;
  
  // Domain validation with stealth mode
  static validateDomain(): boolean {
    const currentDomain = window.location.hostname;
    
    // Allow development and preview environments
    if (currentDomain === 'localhost' || 
        currentDomain.includes('127.0.0.1') ||
        currentDomain.includes('.vercel.app') ||
        currentDomain.includes('.netlify.app')) {
      return true;
    }
    
    // Production domain validation (configured in database)
    return this.checkLicenseValidation(currentDomain);
  }
  
  // Platform fingerprinting for license validation
  static getPlatformFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('AIKEYS Security Check', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).slice(0, 32);
  }
  
  // Anti-debugging measures
  static enableAntiDebugging(): void {
    // Disable right-click in production
    if (process.env.NODE_ENV === 'production') {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('selectstart', (e) => e.preventDefault());
      
      // Console access detection
      let devtools = false;
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: function() {
          devtools = true;
          console.clear();
          console.log('%cUnauthorized Access Detected', 'color: red; font-size: 20px; font-weight: bold;');
          console.log('%cThis platform is protected by enterprise security systems.', 'color: orange; font-size: 14px;');
        }
      });
      
      setInterval(() => {
        console.dir(element);
        if (devtools) {
          // Log security violation
          this.logSecurityViolation('DEVELOPER_TOOLS_ACCESS');
        }
      }, 1000);
    }
  }
  
  // Invisible watermarking
  static addInvisibleWatermark(): void {
    const watermark = document.createElement('div');
    watermark.innerHTML = `
      <!-- AIKEYS Enterprise Platform - Unauthorized reproduction prohibited -->
      <!-- Protected by advanced security systems -->
      <!-- Contact: security@aikeys.ai for licensing -->
    `;
    watermark.style.display = 'none';
    document.body.appendChild(watermark);
    
    // Add metadata watermark
    const meta = document.createElement('meta');
    meta.name = 'aikeys-platform';
    meta.content = 'enterprise-protected';
    document.head.appendChild(meta);
  }
  
  // License verification with backend
  static async verifyPlatformLicense(): Promise<boolean> {
    try {
      const fingerprint = this.getPlatformFingerprint();
      const domain = window.location.hostname;
      
      // This would connect to your license validation API
      const response = await fetch('/api/validate-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, fingerprint })
      });
      
      return response.ok;
    } catch (error) {
      console.error('License validation failed:', error);
      return false;
    }
  }
  
  // Initialize all security measures
  static init(): void {
    if (!this.validateDomain()) {
      document.body.innerHTML = '<div style="padding: 50px; text-align: center; font-family: Arial;"><h1>Unauthorized Access</h1><p>This platform requires a valid license.</p></div>';
      return;
    }
    
    this.enableAntiDebugging();
    this.addInvisibleWatermark();
    this.verifyPlatformLicense();
    
    // Initialize monitoring
    this.startSecurityMonitoring();
  }
  
  private static checkLicenseValidation(domain: string): boolean {
    // This would check against the platform_license table
    // For now, allow all domains (will be configured by protected owner)
    return true;
  }
  
  private static logSecurityViolation(type: string): void {
    // Log to security system
    fetch('/api/security/log-violation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        domain: window.location.hostname,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {
      // Silent fail - security logging
    });
  }
  
  private static startSecurityMonitoring(): void {
    // Monitor for unauthorized modifications
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check for suspicious script injections
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-aikeys-authorized')) {
                this.logSecurityViolation('UNAUTHORIZED_SCRIPT_INJECTION');
              }
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
}

// Auto-initialize security on import
PlatformSecurity.init();