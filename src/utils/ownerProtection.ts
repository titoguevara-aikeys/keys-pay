/*
 * AIKEYS FINANCIAL PLATFORM - OWNER PROTECTION MODULE
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * STEALTH MODE OWNER PROTECTION
 * Protects the platform owner's identity and prevents tampering
 */

interface ProtectedOwner {
  email: string;
  name: string;
  role: 'super_admin';
  isProtected: true;
  stealthMode: true;
}

class OwnerProtectionSystem {
  private static readonly PROTECTED_OWNER: ProtectedOwner = {
    email: 'tito.guevara@gmail.com',
    name: 'System Administrator',
    role: 'super_admin',
    isProtected: true,
    stealthMode: true
  };
  
  // Obfuscated owner identity for stealth mode
  private static readonly STEALTH_IDENTITY = {
    displayName: 'System Administrator',
    publicRole: 'Administrator',
    hiddenDetails: true
  };
  
  // Check if current user is the protected owner
  static isProtectedOwner(userEmail?: string): boolean {
    if (!userEmail) return false;
    return userEmail.toLowerCase() === this.PROTECTED_OWNER.email.toLowerCase();
  }
  
  // Get sanitized user info for display (hides owner identity)
  static getSanitizedUserInfo(user: any): any {
    if (this.isProtectedOwner(user?.email)) {
      return {
        ...user,
        email: '***@***.***',
        first_name: 'System',
        last_name: 'Administrator',
        display_name: this.STEALTH_IDENTITY.displayName,
        role: this.STEALTH_IDENTITY.publicRole,
        is_protected: true,
        stealth_mode: true
      };
    }
    return user;
  }
  
  // Prevent owner data exposure in admin panels
  static filterOwnerFromAdminLists(users: any[]): any[] {
    return users.filter(user => !this.isProtectedOwner(user?.email));
  }
  
  // Special handling for owner authentication
  static handleOwnerAuth(email: string): boolean {
    if (this.isProtectedOwner(email)) {
      // Log owner access with enhanced security
      this.logOwnerAccess();
      return true;
    }
    return false;
  }
  
  // Enhanced security logging for owner access
  private static logOwnerAccess(): void {
    const securityLog = {
      event: 'PROTECTED_OWNER_ACCESS',
      timestamp: new Date().toISOString(),
      ip: 'PROTECTED',
      userAgent: 'PROTECTED',
      fingerprint: this.generateSecureFingerprint(),
      level: 'CRITICAL'
    };
    
    // Send to secure logging endpoint
    fetch('/api/security/owner-access', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Security-Level': 'MAXIMUM'
      },
      body: JSON.stringify(securityLog)
    }).catch(() => {
      // Silent fail for security
    });
  }
  
  // Generate secure fingerprint for owner sessions
  private static generateSecureFingerprint(): string {
    const components = [
      navigator.userAgent,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.language,
      'AIKEYS_SECURE_' + Date.now()
    ];
    
    return btoa(components.join('|')).slice(0, 32);
  }
  
  // Protect owner from role modifications
  static validateRoleChange(userEmail: string, newRole: string): boolean {
    if (this.isProtectedOwner(userEmail)) {
      // Owner role cannot be changed
      console.warn('Attempt to modify protected owner role blocked');
      return false;
    }
    return true;
  }
  
  // Hide owner from developer tools and admin interfaces
  static applyStealthMode(): void {
    // Override console methods to hide owner-related data
    if (process.env.NODE_ENV === 'production') {
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      
      console.log = (...args: any[]) => {
        const filteredArgs = args.map(arg => 
          typeof arg === 'string' && arg.includes(this.PROTECTED_OWNER.email) 
            ? arg.replace(this.PROTECTED_OWNER.email, '***@***.***')
            : arg
        );
        originalLog.apply(console, filteredArgs);
      };
      
      console.error = (...args: any[]) => {
        const filteredArgs = args.map(arg => 
          typeof arg === 'string' && arg.includes(this.PROTECTED_OWNER.email)
            ? arg.replace(this.PROTECTED_OWNER.email, '***@***.***')
            : arg
        );
        originalError.apply(console, filteredArgs);
      };
      
      console.warn = (...args: any[]) => {
        const filteredArgs = args.map(arg => 
          typeof arg === 'string' && arg.includes(this.PROTECTED_OWNER.email)
            ? arg.replace(this.PROTECTED_OWNER.email, '***@***.***')
            : arg
        );
        originalWarn.apply(console, filteredArgs);
      };
    }
  }
}

// Auto-initialize stealth mode
OwnerProtectionSystem.applyStealthMode();

export { OwnerProtectionSystem };