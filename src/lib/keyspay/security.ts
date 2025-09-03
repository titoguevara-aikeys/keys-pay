import crypto from 'crypto';

export function generateHMAC(payload: string, secret: string): string {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyHMAC(payload: string, signature: string, secret: string): boolean {
  const expected = generateHMAC(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(signature, 'hex')
  );
}

export function generateTransactionRef(): string {
  return `KP_${Date.now()}_${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
}

export function maskIBAN(iban: string): string {
  if (iban.length < 8) return iban;
  return iban.slice(0, 4) + '*'.repeat(iban.length - 8) + iban.slice(-4);
}

export function maskCardNumber(cardNumber: string): string {
  if (cardNumber.length < 8) return cardNumber;
  return cardNumber.slice(0, 4) + ' **** **** ' + cardNumber.slice(-4);
}

export interface RateLimitResult {
  allowed: boolean;
  remainingRequests?: number;
  resetTime?: number;
  violationCount?: number;
  blockUntil?: number;
}

export class EnhancedRateLimiter {
  private requests = new Map<string, { 
    count: number; 
    resetTime: number; 
    violations: number;
    blockUntil?: number;
    firstViolation?: number;
  }>();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000, // 1 minute
    private violationThreshold: number = 3,
    private blockDurationMs: number = 15 * 60 * 1000 // 15 minutes
  ) {}
  
  isAllowed(identifier: string, endpoint?: string): RateLimitResult {
    const now = Date.now();
    const key = identifier;
    const current = this.requests.get(key);
    
    // Check if currently blocked
    if (current?.blockUntil && now < current.blockUntil) {
      return {
        allowed: false,
        blockUntil: current.blockUntil,
        violationCount: current.violations
      };
    }
    
    if (!current || now > current.resetTime) {
      this.requests.set(key, { 
        count: 1, 
        resetTime: now + this.windowMs,
        violations: current?.violations || 0,
        firstViolation: current?.firstViolation
      });
      return {
        allowed: true,
        remainingRequests: this.maxRequests - 1,
        resetTime: now + this.windowMs
      };
    }
    
    if (current.count >= this.maxRequests) {
      current.violations++;
      
      // Progressive blocking based on violation history
      if (current.violations >= this.violationThreshold) {
        const blockDuration = Math.min(
          current.violations * this.blockDurationMs, 
          24 * 60 * 60 * 1000 // Max 24 hours
        );
        current.blockUntil = now + blockDuration;
        
        // Log security event
        this.logViolation(identifier, current.violations, endpoint);
      }
      
      return {
        allowed: false,
        violationCount: current.violations,
        blockUntil: current.blockUntil
      };
    }
    
    current.count++;
    return {
      allowed: true,
      remainingRequests: this.maxRequests - current.count,
      resetTime: current.resetTime
    };
  }
  
  private logViolation(identifier: string, violations: number, endpoint?: string): void {
    // Dispatch security event for monitoring
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('securityEvent', {
        detail: {
          type: 'RATE_LIMIT_EXCEEDED',
          severity: violations > 5 ? 'critical' : 'high',
          metadata: {
            identifier,
            endpoint,
            violations,
            timestamp: new Date().toISOString()
          }
        }
      }));
    }
    
    console.warn(`🚨 Rate limit violation: ${identifier} (${violations} violations)`);
  }
  
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime && (!value.blockUntil || now > value.blockUntil)) {
        this.requests.delete(key);
      }
    }
  }
  
  // Reset violations for a specific identifier (admin function)
  resetViolations(identifier: string): void {
    const current = this.requests.get(identifier);
    if (current) {
      current.violations = 0;
      current.blockUntil = undefined;
    }
  }
  
  // Get current stats for monitoring
  getStats(): { totalEntries: number; blockedEntries: number; violationEntries: number } {
    const now = Date.now();
    let totalEntries = 0;
    let blockedEntries = 0;
    let violationEntries = 0;
    
    for (const [, value] of this.requests.entries()) {
      totalEntries++;
      if (value.blockUntil && now < value.blockUntil) blockedEntries++;
      if (value.violations > 0) violationEntries++;
    }
    
    return { totalEntries, blockedEntries, violationEntries };
  }
}

export const defaultRateLimiter = new EnhancedRateLimiter();

// Enhanced cleanup and monitoring
setInterval(() => {
  defaultRateLimiter.cleanup();
  
  // Log rate limiter stats periodically
  const stats = defaultRateLimiter.getStats();
  if (stats.blockedEntries > 0 || stats.violationEntries > 0) {
    console.info('🛡️ Rate Limiter Stats:', stats);
  }
}, 5 * 60 * 1000); // Every 5 minutes

// Security event monitoring for rate limiting
export const monitorSecurityEvents = () => {
  if (typeof window === 'undefined') return;
  
  let eventCount = 0;
  let criticalEventCount = 0;
  
  const handleSecurityEvent = (event: CustomEvent) => {
    eventCount++;
    if (event.detail?.severity === 'critical') {
      criticalEventCount++;
    }
    
    // Auto-escalate if too many critical events
    if (criticalEventCount >= 3) {
      console.error('🚨 Multiple critical security events detected - escalating');
      // In production, this would trigger additional alerting
    }
  };
  
  window.addEventListener('securityEvent', handleSecurityEvent as EventListener);
  
  // Reset counters hourly
  setInterval(() => {
    eventCount = 0;
    criticalEventCount = 0;
  }, 60 * 60 * 1000);
};