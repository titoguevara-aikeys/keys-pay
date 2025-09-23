// Security middleware for development and production
export const securityHeaders = {
  'Content-Security-Policy': `
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
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim(),
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin'
};

export const setCORSHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' ? 'https://keys-pay.com' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Max-Age': '86400'
};

// Rate limiting for API calls (simple in-memory store for demo)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (
  identifier: string, 
  maxRequests: number = 60, 
  windowMs: number = 60000
): boolean => {
  const now = Date.now();
  const userLimit = rateLimitStore.get(identifier);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (userLimit.count >= maxRequests) {
    return false;
  }
  
  userLimit.count++;
  return true;
};

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