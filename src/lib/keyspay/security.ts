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

export class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const key = identifier;
    const current = this.requests.get(key);
    
    if (!current || now > current.resetTime) {
      this.requests.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }
    
    if (current.count >= this.maxRequests) {
      return false;
    }
    
    current.count++;
    return true;
  }
  
  cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.requests.entries()) {
      if (now > value.resetTime) {
        this.requests.delete(key);
      }
    }
  }
}

export const defaultRateLimiter = new RateLimiter();

// Cleanup rate limiter every 5 minutes
setInterval(() => defaultRateLimiter.cleanup(), 5 * 60 * 1000);