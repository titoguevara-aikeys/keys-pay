import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NiumClient } from '../client';

// Mock environment variables
const mockEnv = {
  NIUM_API_KEY: 'test-api-key',
  NIUM_CLIENT_HASH_ID: '12345678-1234-1234-1234-123456789012',
  NIUM_CLIENT_NAME: 'Test Client',
  NIUM_ENV: 'sandbox'
};

describe('NiumClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.assign(process.env, mockEnv);
  });

  describe('constructor', () => {
    it('should initialize with environment variables', () => {
      const client = new NiumClient();
      const config = client.getConfig();
      
      expect(config.env).toBe('sandbox');
      expect(config.clientName).toBe('Test Client');
      expect(config.baseUrl).toBe('https://gateway.nium.com/api');
    });

    it('should use provided config over environment variables', () => {
      const client = new NiumClient({
        env: 'production',
        clientName: 'Override Client'
      });
      const config = client.getConfig();
      
      expect(config.env).toBe('production');
      expect(config.clientName).toBe('Override Client');
    });

    it('should throw error if required config is missing', () => {
      delete process.env.NIUM_API_KEY;
      delete process.env.NIUM_CLIENT_HASH_ID;
      
      expect(() => new NiumClient()).toThrow('NIUM API key and client hash ID are required');
    });
  });

  describe('baseUrl', () => {
    it('should return correct sandbox URL', () => {
      const client = new NiumClient();
      expect(client.baseUrl()).toBe('https://gateway.nium.com/api');
    });
  });

  describe('headers', () => {
    it('should generate correct headers', () => {
      const client = new NiumClient();
      const headers = client['headers']('test-request-id');
      
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['x-api-key']).toBe('test-api-key');
      expect(headers['x-client-name']).toBe('Test Client');
      expect(headers['x-request-id']).toBe('test-request-id');
    });

    it('should generate UUID for request ID if not provided', () => {
      const client = new NiumClient();
      const headers = client['headers']();
      
      expect(headers['x-request-id']).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('rate limiting', () => {
    it('should enforce global rate limit', async () => {
      const client = new NiumClient();
      
      // Mock 21 rapid requests to exceed 20 rps limit
      const promises = Array.from({ length: 21 }, () => 
        client['checkRateLimit']()
      );
      
      // The 21st request should throw
      await expect(Promise.all(promises)).rejects.toThrow('Rate limit exceeded: global 20 rps');
    });

    it('should enforce wallet-specific rate limit', async () => {
      const client = new NiumClient();
      const walletId = 'test-wallet-id';
      
      // Mock 4 rapid requests to same wallet to exceed 3 rps limit
      const promises = Array.from({ length: 4 }, () => 
        client['checkRateLimit'](walletId)
      );
      
      // The 4th request should throw
      await expect(Promise.all(promises)).rejects.toThrow('Rate limit exceeded');
    });
  });

  describe('PII masking', () => {
    it('should mask short values completely', () => {
      const client = new NiumClient();
      const masked = client['maskPii']('short');
      expect(masked).toBe('***');
    });

    it('should mask long values with first and last 4 characters', () => {
      const client = new NiumClient();
      const masked = client['maskPii']('1234567890abcdef');
      expect(masked).toBe('1234***cdef');
    });
  });

  describe('HTTP methods', () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it('should make GET request with correct parameters', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'test' }) };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);
      
      const client = new NiumClient();
      const searchParams = new URLSearchParams({ param1: 'value1' });
      
      await client.get('/test-path', searchParams);
      
      expect(fetch).toHaveBeenCalledWith(
        'https://gateway.nium.com/api/test-path?param1=value1',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-api-key': 'test-api-key',
            'x-client-name': 'Test Client'
          })
        })
      );
    });

    it('should make POST request with correct body', async () => {
      const mockResponse = { ok: true, json: () => Promise.resolve({ data: 'test' }) };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);
      
      const client = new NiumClient();
      const body = { key: 'value' };
      
      await client.post('/test-path', body);
      
      expect(fetch).toHaveBeenCalledWith(
        'https://gateway.nium.com/api/test-path',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should handle API errors correctly', async () => {
      const mockResponse = { 
        ok: false, 
        status: 400, 
        statusText: 'Bad Request',
        text: () => Promise.resolve('Error message') 
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);
      
      const client = new NiumClient();
      
      await expect(client.get('/test-path')).rejects.toThrow('NIUM API error: 400 Bad Request');
    });

    it('should retry on 429 rate limit', async () => {
      const rateLimitResponse = { 
        ok: false, 
        status: 429, 
        statusText: 'Too Many Requests',
        text: () => Promise.resolve('Rate limited') 
      };
      const successResponse = { 
        ok: true, 
        json: () => Promise.resolve({ data: 'success' }) 
      };
      
      global.fetch = vi.fn()
        .mockResolvedValueOnce(rateLimitResponse)
        .mockResolvedValueOnce(successResponse);
      
      const client = new NiumClient();
      const result = await client.get('/test-path');
      
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ data: 'success' });
    });
  });
});