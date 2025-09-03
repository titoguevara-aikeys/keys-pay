// Enhanced Security middleware with optimizations
import { generateTransactionRef } from '@/lib/keyspay/security';

// Generate request ID for tracking
export const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Production-ready security headers with enhanced CSP
export const securityHeaders = {
  'Content-Security-Policy': process.env.NODE_ENV === 'production' 
    ? `
      default-src 'self';
      script-src 'self' 'nonce-${generateRequestId()}';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: blob: https:;
      font-src 'self' data:;
      connect-src 'self' https://emolyyvmvvfjyxbguhyn.supabase.co https://api.aikeys.com;
      media-src 'self' blob: data:;
      worker-src 'self' blob:;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
      object-src 'none';
      upgrade-insecure-requests;
    `.replace(/\s+/g, ' ').trim()
    : `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data:;
      style-src 'self' 'unsafe-inline' data:;
      img-src 'self' data: blob: https:;
      font-src 'self' data:;
      connect-src 'self' https: wss: ws: http://localhost:*;
      media-src 'self' blob: data:;
      worker-src 'self' blob:;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
      object-src 'none';
    `.replace(/\s+/g, ' ').trim(),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'X-Request-ID': generateRequestId()
};

export const setCORSHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://aikeys-hub.com' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

// Enhanced progressive rate limiting with violation tracking
interface RateLimitEntry {
  count: number;
  resetTime: number;
  violations: number;
  blockUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();
const suspiciousIPs = new Set<string>();

export const rateLimit = (
  identifier: string, 
  maxRequests: number = 60, 
  windowMs: number = 60000,
  endpoint?: string
): { allowed: boolean; remainingRequests?: number; blockUntil?: number } => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);
  
  // Check if currently blocked
  if (userLimit?.blockUntil && now < userLimit.blockUntil) {
    return { allowed: false, blockUntil: userLimit.blockUntil };
  }
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
      violations: userLimit?.violations || 0
    });
    return { allowed: true, remainingRequests: maxRequests - 1 };
  }
  
  if (userLimit.count >= maxRequests) {
    // Progressive penalties for repeated violations
    userLimit.violations++;
    const blockDuration = Math.min(userLimit.violations * 5 * 60 * 1000, 60 * 60 * 1000); // Max 1 hour
    userLimit.blockUntil = now + blockDuration;
    
    // Track suspicious IPs
    suspiciousIPs.add(identifier);
    
    // Log security event
    logSecurityViolation(identifier, 'RATE_LIMIT_EXCEEDED', { 
      endpoint, 
      violations: userLimit.violations,
      blockDuration 
    });
    
    return { allowed: false, blockUntil: userLimit.blockUntil };
  }
  
  userLimit.count++;
  return { allowed: true, remainingRequests: maxRequests - userLimit.count };
};

// Security event logging
async function logSecurityViolation(identifier: string, eventType: string, metadata: any) {
  try {
    // In production, this would send to your logging service or Supabase
    console.warn(`🚨 Security Event: ${eventType}`, { identifier, metadata, timestamp: new Date().toISOString() });
    
    // Could integrate with Supabase security events table here
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('securityEvent', {
        detail: { type: eventType, severity: 'high', metadata }
      }));
    }
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

// Input sanitization
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim()
    .slice(0, 5000); // Max length
};

// CSRF token generation (simple implementation)
export const generateCSRFToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken && token.length === 64;
};