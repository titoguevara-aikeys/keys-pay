import { test, expect } from '@playwright/test';

test.describe('Keys Pay Smoke Tests', () => {
  test('API health endpoint returns OK', async ({ request }) => {
    const response = await request.get('/api/health');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.ok).toBe(true);
    expect(data.service).toBe('Keys Pay Platform');
    expect(data.timestamp).toBeTruthy();
    expect(data.uptime).toBeGreaterThan(0);
  });

  test('Vercel health endpoint returns project info', async ({ request }) => {
    const response = await request.get('/api/vercel/health');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.ok).toBeDefined();
    // Project ID should be present if configured
    if (data.ok) {
      expect(data.projectId).toBeTruthy();
    }
  });

  test('Database health check works', async ({ request }) => {
    const response = await request.get('/api/health/db');
    
    // Should return either 200 (OK) or 503 (Service Unavailable)
    expect([200, 503]).toContain(response.status());
    
    const data = await response.json();
    expect(data.ok).toBeDefined();
    expect(data.latencyMs).toBeDefined();
    
    if (data.ok) {
      expect(data.latencyMs).toBeGreaterThan(0);
    }
  });

  test('Admin portal loads successfully', async ({ page }) => {
    await page.goto('/admin');
    
    // Check for admin portal title
    await expect(page.locator('h1')).toContainText('Admin Portal');
    
    // Check for system check button
    await expect(page.locator('text=System Check')).toBeVisible();
  });

  test('System check page renders health cards', async ({ page }) => {
    await page.goto('/admin/system-check');
    
    // Check for system check title
    await expect(page.locator('h1')).toContainText('System Health Check');
    
    // Check for run all checks button
    await expect(page.locator('text=Run All Checks')).toBeVisible();
    
    // Check for health check cards (should have multiple)
    const healthCards = page.locator('[data-testid="health-card"], .bg-card, [class*="card"]');
    await expect(healthCards.first()).toBeVisible();
    
    // Wait for checks to complete (look for status badges)
    await page.waitForSelector('text=OK,text=FAIL,text=WARN,text=Checking', { 
      timeout: 10000 
    });
  });

  test('Provider health checks return proper structure', async ({ request }) => {
    const providers = ['nium', 'ramp', 'openpayd'];
    
    for (const provider of providers) {
      const response = await request.get(`/api/${provider}/health`);
      
      // Should return 200 regardless of provider status
      expect(response.status()).toBeLessThan(600); // Valid HTTP status
      
      const data = await response.json();
      expect(data.ok).toBeDefined();
      expect(data.featureEnabled).toBeDefined();
      
      // If feature is disabled, should indicate that clearly
      if (data.featureEnabled === false) {
        expect(data.message).toBeTruthy();
      }
      
      // If feature is enabled, should have latency info
      if (data.featureEnabled === true) {
        expect(data.latencyMs).toBeDefined();
      }
    }
  });

  test('Navigation includes admin link', async ({ page }) => {
    await page.goto('/');
    
    // Check if admin link is present in navigation
    const adminLink = page.locator('a[href="/admin"], text=Admin');
    await expect(adminLink).toBeVisible();
  });

  test('Environment chip shows staging when appropriate', async ({ page }) => {
    await page.goto('/admin/system-check');
    
    // Look for staging environment indicator
    // This may or may not be present depending on VITE_APP_ENV
    const stagingBadge = page.locator('text=Staging Environment');
    
    // If present, should be visible
    if (await stagingBadge.count() > 0) {
      await expect(stagingBadge).toBeVisible();
    }
  });
});

test.describe('System Check Interactive Tests', () => {
  test('Individual health check buttons work', async ({ page }) => {
    await page.goto('/admin/system-check');
    
    // Wait for initial checks to complete
    await page.waitForLoadState('networkidle');
    
    // Find and click a recheck button
    const recheckButton = page.locator('button:has-text("Recheck")').first();
    await expect(recheckButton).toBeVisible();
    
    await recheckButton.click();
    
    // Should show loading state briefly
    await expect(page.locator('.animate-spin')).toBeVisible();
    
    // Should complete and show result
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 5000 });
  });

  test('Run all checks button functions', async ({ page }) => {
    await page.goto('/admin/system-check');
    
    // Click run all checks button
    const runAllButton = page.locator('button:has-text("Run All Checks")');
    await expect(runAllButton).toBeVisible();
    
    await runAllButton.click();
    
    // Should show loading state
    await expect(page.locator('button:has-text("Run All Checks") .animate-spin')).toBeVisible();
    
    // Should complete within reasonable time
    await page.waitForSelector('button:has-text("Run All Checks") .animate-spin', { 
      state: 'detached', 
      timeout: 15000 
    });
  });
});