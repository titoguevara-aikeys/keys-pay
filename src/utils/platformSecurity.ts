// Platform Security Utilities
// Additional anti-cloning and protection measures

export class PlatformSecurity {
  // Check if platform is running on authorized domain
  static validateDomain(): boolean {
    const currentDomain = window.location.hostname;
    const authorizedDomains = [
      'www.keys-pay.com',
      'keys-pay.com',
      'localhost' // for development
    ];
    
    // Allow all development and preview environments
    if (currentDomain.includes('lovableproject.com') || 
        currentDomain.includes('vercel.app') ||
        currentDomain.includes('netlify.app') ||
        currentDomain.includes('preview') ||
        currentDomain.includes('staging') ||
        currentDomain === 'localhost' ||
        currentDomain.startsWith('127.0.0.1') ||
        currentDomain.startsWith('192.168')) {
      return true;
    }
    
    return authorizedDomains.includes(currentDomain);
  }

  // Generate unique platform fingerprint
  static getPlatformFingerprint(): string {
    const components = [
      navigator.userAgent,
      screen.width,
      screen.height,
      navigator.language,
      window.location.hostname,
      new Date().getTimezoneOffset()
    ];
    
    return btoa(components.join('|'));
  }

  // Anti-debugging protection
  static enableAntiDebugging(): void {
    // Detect DevTools
    setInterval(() => {
      const startTime = performance.now();
      debugger; // This will pause if DevTools is open
      const endTime = performance.now();
      
      if (endTime - startTime > 100) {
        console.clear();
        console.log('⚠️ Platform Protection Active');
      }
    }, 1000);

    // Disable right-click in production
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
      document.addEventListener('selectstart', (e) => e.preventDefault());
      document.addEventListener('dragstart', (e) => e.preventDefault());
    }
  }

  // Watermark protection
  static addInvisibleWatermark(): void {
    const watermark = document.createElement('div');
    watermark.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><text x="50%" y="50%" text-anchor="middle" opacity="0.02" font-size="12">AIKEYS PLATFORM</text></svg>');
    `;
    document.body.appendChild(watermark);
  }

  // License verification
  static async verifyPlatformLicense(): Promise<boolean> {
    try {
      const response = await fetch('/api/verify-license', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: window.location.hostname,
          fingerprint: this.getPlatformFingerprint()
        })
      });
      
      return response.ok;
    } catch {
      return false;
    }
  }

  // Initialize all protection measures
  static init(): void {
    if (!this.validateDomain()) {
      document.body.innerHTML = '<h1>Unauthorized Access</h1>';
      return;
    }

    this.enableAntiDebugging();
    this.addInvisibleWatermark();
    this.verifyPlatformLicense();
  }
}

// SECURITY DISABLED FOR BETA TESTING
// PlatformSecurity.init();