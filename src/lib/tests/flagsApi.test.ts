/*
 * AIKEYS FINANCIAL PLATFORM - FLAGS API TESTS
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleFlagsRequest } from '@/api/admin/flags';

// Mock environment
vi.mock('import.meta', () => ({
  env: {
    VITE_ADMIN_API_SECRET: 'test-secret'
  }
}));

// Mock flags module
vi.mock('@/lib/flags', () => ({
  getServerFlag: vi.fn(),
  setServerFlag: vi.fn(),
  isForceFullMonitoring: vi.fn(),
  getFlagStoreType: vi.fn(() => 'supabase'),
}));

describe('Admin Flags API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication', () => {
    it('should reject requests without admin secret header', async () => {
      const request = new Request('http://localhost/flags', {
        method: 'GET',
        headers: {}
      });

      const response = await handleFlagsRequest(request);
      
      expect(response.status).toBe(403);
      const data = await response.json();
      expect(data.error).toContain('Unauthorized');
    });

    it('should reject requests with invalid admin secret', async () => {
      const request = new Request('http://localhost/flags', {
        method: 'GET',
        headers: {
          'x-admin-secret': 'wrong-secret'
        }
      });

      const response = await handleFlagsRequest(request);
      
      expect(response.status).toBe(403);
    });

    it('should accept requests with valid admin secret', async () => {
      const { getServerFlag, isForceFullMonitoring } = await import('@/lib/flags');
      
      vi.mocked(getServerFlag).mockResolvedValue('off');
      vi.mocked(isForceFullMonitoring).mockReturnValue(false);

      const request = new Request('http://localhost/flags', {
        method: 'GET',
        headers: {
          'x-admin-secret': 'test-secret'
        }
      });

      const response = await handleFlagsRequest(request);
      
      expect(response.status).toBe(200);
    });
  });

  describe('GET /flags', () => {
    it('should return current flag status', async () => {
      const { getServerFlag, isForceFullMonitoring, getFlagStoreType } = await import('@/lib/flags');
      
      vi.mocked(getServerFlag).mockResolvedValue('on');
      vi.mocked(isForceFullMonitoring).mockReturnValue(false);
      vi.mocked(getFlagStoreType).mockReturnValue('supabase');

      const request = new Request('http://localhost/flags', {
        method: 'GET',
        headers: {
          'x-admin-secret': 'test-secret'
        }
      });

      const response = await handleFlagsRequest(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toEqual({
        flags: {
          beta_monitoring: 'on'
        },
        force_full_monitoring: false,
        store: 'supabase'
      });
    });
  });

  describe('POST /flags', () => {
    it('should reject invalid flag keys', async () => {
      const request = new Request('http://localhost/flags', {
        method: 'POST',
        headers: {
          'x-admin-secret': 'test-secret',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          key: 'invalid_flag',
          value: 'on'
        })
      });

      const response = await handleFlagsRequest(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid flag key');
    });

    it('should reject invalid flag values', async () => {
      const request = new Request('http://localhost/flags', {
        method: 'POST',
        headers: {
          'x-admin-secret': 'test-secret',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          key: 'beta_monitoring',
          value: 'invalid'
        })
      });

      const response = await handleFlagsRequest(request);
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain('Invalid flag value');
    });

    it('should prevent enabling beta when force monitoring is active', async () => {
      const { isForceFullMonitoring } = await import('@/lib/flags');
      
      vi.mocked(isForceFullMonitoring).mockReturnValue(true);

      const request = new Request('http://localhost/flags', {
        method: 'POST',
        headers: {
          'x-admin-secret': 'test-secret',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          key: 'beta_monitoring',
          value: 'on'
        })
      });

      const response = await handleFlagsRequest(request);
      
      expect(response.status).toBe(409);
      const data = await response.json();
      expect(data.error).toContain('FORCE_FULL_MONITORING');
      expect(data.force_full_monitoring).toBe(true);
    });

    it('should successfully set valid flags', async () => {
      const { setServerFlag, isForceFullMonitoring } = await import('@/lib/flags');
      
      vi.mocked(isForceFullMonitoring).mockReturnValue(false);
      vi.mocked(setServerFlag).mockResolvedValue(true);

      const request = new Request('http://localhost/flags', {
        method: 'POST',
        headers: {
          'x-admin-secret': 'test-secret',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          key: 'beta_monitoring',
          value: 'on'
        })
      });

      const response = await handleFlagsRequest(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.ok).toBe(true);
      expect(data.key).toBe('beta_monitoring');
      expect(data.value).toBe('on');
      expect(setServerFlag).toHaveBeenCalledWith('beta_monitoring', 'on', 'admin-api');
    });
  });

  describe('CORS', () => {
    it('should handle OPTIONS preflight requests', async () => {
      const request = new Request('http://localhost/flags', {
        method: 'OPTIONS'
      });

      const response = await handleFlagsRequest(request);
      
      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });
});