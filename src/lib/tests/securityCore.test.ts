/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY CORE TESTS
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { computeMonitoringIntervalMs, DEFAULT_INTERVAL_MS, BETA_INTERVAL_MS } from '@/utils/securityCore';

// Mock the flags module
vi.mock('@/lib/flags', () => ({
  getServerFlag: vi.fn(),
  isForceFullMonitoring: vi.fn(),
}));

describe('Security Core Monitoring', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return default interval when force monitoring is true', async () => {
    const { getServerFlag, isForceFullMonitoring } = await import('@/lib/flags');
    
    vi.mocked(isForceFullMonitoring).mockReturnValue(true);
    vi.mocked(getServerFlag).mockResolvedValue('on');

    const interval = await computeMonitoringIntervalMs();
    
    expect(interval).toBe(DEFAULT_INTERVAL_MS);
    expect(isForceFullMonitoring).toHaveBeenCalled();
    // Should not check server flag when force is true
    expect(getServerFlag).not.toHaveBeenCalled();
  });

  it('should return beta interval when force is false and beta flag is on', async () => {
    const { getServerFlag, isForceFullMonitoring } = await import('@/lib/flags');
    
    vi.mocked(isForceFullMonitoring).mockReturnValue(false);
    vi.mocked(getServerFlag).mockResolvedValue('on');

    const interval = await computeMonitoringIntervalMs();
    
    expect(interval).toBe(BETA_INTERVAL_MS);
    expect(isForceFullMonitoring).toHaveBeenCalled();
    expect(getServerFlag).toHaveBeenCalledWith('beta_monitoring');
  });

  it('should return default interval when force is false and beta flag is off', async () => {
    const { getServerFlag, isForceFullMonitoring } = await import('@/lib/flags');
    
    vi.mocked(isForceFullMonitoring).mockReturnValue(false);
    vi.mocked(getServerFlag).mockResolvedValue('off');

    const interval = await computeMonitoringIntervalMs();
    
    expect(interval).toBe(DEFAULT_INTERVAL_MS);
    expect(isForceFullMonitoring).toHaveBeenCalled();
    expect(getServerFlag).toHaveBeenCalledWith('beta_monitoring');
  });

  it('should return default interval on error (safe fallback)', async () => {
    const { getServerFlag, isForceFullMonitoring } = await import('@/lib/flags');
    
    vi.mocked(isForceFullMonitoring).mockImplementation(() => {
      throw new Error('Flag system error');
    });

    const interval = await computeMonitoringIntervalMs();
    
    expect(interval).toBe(DEFAULT_INTERVAL_MS);
  });

  it('should validate interval constants', () => {
    expect(DEFAULT_INTERVAL_MS).toBe(30_000); // 30 seconds
    expect(BETA_INTERVAL_MS).toBe(300_000); // 5 minutes
    expect(BETA_INTERVAL_MS).toBeGreaterThan(DEFAULT_INTERVAL_MS);
  });
});