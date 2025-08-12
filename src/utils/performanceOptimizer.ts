// Performance Optimization Utilities for Keys Pay Beta
// Implements caching, query optimization, and auto-scaling logic

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

interface QueryMetrics {
  queryId: string;
  executionTime: number;
  resultSize: number;
  cacheHit: boolean;
  timestamp: number;
}

interface PerformanceConfig {
  cacheEnabled: boolean;
  defaultTTL: number;
  maxCacheSize: number;
  queryTimeoutMs: number;
  retryAttempts: number;
  retryDelayMs: number;
}

class PerformanceOptimizer {
  private cache = new Map<string, CacheEntry<any>>();
  private queryMetrics: QueryMetrics[] = [];
  private config: PerformanceConfig;
  
  constructor(config: Partial<PerformanceConfig> = {}) {
    this.config = {
      cacheEnabled: true,
      defaultTTL: 5 * 60 * 1000, // 5 minutes
      maxCacheSize: 1000,
      queryTimeoutMs: 30000, // 30 seconds
      retryAttempts: 3,
      retryDelayMs: 1000,
      ...config
    };
  }

  /**
   * Cached query executor with performance monitoring
   */
  async executeQuery<T>(
    queryId: string,
    queryFn: () => Promise<T>,
    options: {
      ttl?: number;
      skipCache?: boolean;
      timeout?: number;
    } = {}
  ): Promise<T> {
    const startTime = performance.now();
    const cacheKey = this.generateCacheKey(queryId, options);
    
    // Check cache first
    if (this.config.cacheEnabled && !options.skipCache) {
      const cached = this.getFromCache<T>(cacheKey);
      if (cached) {
        this.recordMetrics({
          queryId,
          executionTime: performance.now() - startTime,
          resultSize: this.estimateSize(cached),
          cacheHit: true,
          timestamp: Date.now()
        });
        return cached;
      }
    }

    // Execute query with timeout and retries
    const result = await this.executeWithRetry(
      queryFn,
      options.timeout || this.config.queryTimeoutMs
    );

    // Cache result
    if (this.config.cacheEnabled && !options.skipCache) {
      this.setCache(cacheKey, result, options.ttl || this.config.defaultTTL);
    }

    // Record metrics
    this.recordMetrics({
      queryId,
      executionTime: performance.now() - startTime,
      resultSize: this.estimateSize(result),
      cacheHit: false,
      timestamp: Date.now()
    });

    return result;
  }

  /**
   * Execute function with retry logic and timeout
   */
  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    timeoutMs: number
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= this.config.retryAttempts; attempt++) {
      try {
        return await this.withTimeout(fn(), timeoutMs);
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (this.shouldNotRetry(error)) {
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        if (attempt < this.config.retryAttempts) {
          await this.delay(this.config.retryDelayMs * Math.pow(2, attempt));
        }
      }
    }
    
    throw lastError!;
  }

  /**
   * Add timeout to promise
   */
  private withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      promise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
      )
    ]);
  }

  /**
   * Determine if error should not be retried
   */
  private shouldNotRetry(error: any): boolean {
    // Don't retry authentication errors, validation errors, etc.
    return error?.status === 401 || 
           error?.status === 403 || 
           error?.status === 422 ||
           error?.message?.includes('validation');
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(queryId: string, options: any): string {
    return `${queryId}_${JSON.stringify(options)}`;
  }

  /**
   * Get item from cache
   */
  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    // Check if expired
    if (Date.now() > entry.timestamp + entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Set item in cache
   */
  private setCache<T>(key: string, data: T, ttl: number): void {
    // Clean up cache if it's too large
    if (this.cache.size >= this.config.maxCacheSize) {
      this.cleanupCache();
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.timestamp + entry.ttl) {
        this.cache.delete(key);
      }
    }
    
    // If still too large, remove oldest entries
    if (this.cache.size >= this.config.maxCacheSize) {
      const entries = Array.from(this.cache.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp);
      
      const toRemove = entries.slice(0, Math.floor(this.config.maxCacheSize * 0.2));
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * Record query metrics
   */
  private recordMetrics(metrics: QueryMetrics): void {
    this.queryMetrics.push(metrics);
    
    // Keep only last 1000 metrics
    if (this.queryMetrics.length > 1000) {
      this.queryMetrics = this.queryMetrics.slice(-1000);
    }
  }

  /**
   * Estimate object size in bytes
   */
  private estimateSize(obj: any): number {
    try {
      return new Blob([JSON.stringify(obj)]).size;
    } catch {
      return 0;
    }
  }

  /**
   * Delay utility
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get performance analytics
   */
  getPerformanceAnalytics() {
    const now = Date.now();
    const lastHour = this.queryMetrics.filter(m => now - m.timestamp < 3600000);
    
    if (lastHour.length === 0) {
      return {
        totalQueries: 0,
        averageExecutionTime: 0,
        cacheHitRate: 0,
        slowQueries: [],
        topQueries: []
      };
    }
    
    const totalTime = lastHour.reduce((sum, m) => sum + m.executionTime, 0);
    const cacheHits = lastHour.filter(m => m.cacheHit).length;
    
    return {
      totalQueries: lastHour.length,
      averageExecutionTime: totalTime / lastHour.length,
      cacheHitRate: (cacheHits / lastHour.length) * 100,
      slowQueries: lastHour
        .filter(m => m.executionTime > 1000)
        .sort((a, b) => b.executionTime - a.executionTime)
        .slice(0, 10),
      topQueries: this.getTopQueries(lastHour)
    };
  }

  /**
   * Get most frequently executed queries
   */
  private getTopQueries(metrics: QueryMetrics[]) {
    const queryCount = new Map<string, number>();
    
    metrics.forEach(m => {
      queryCount.set(m.queryId, (queryCount.get(m.queryId) || 0) + 1);
    });
    
    return Array.from(queryCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([queryId, count]) => ({ queryId, count }));
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getCacheStats() {
    const totalEntries = this.cache.size;
    const now = Date.now();
    let totalSize = 0;
    let expiredEntries = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      totalSize += this.estimateSize(entry.data);
      if (now > entry.timestamp + entry.ttl) {
        expiredEntries++;
      }
    }
    
    return {
      totalEntries,
      expiredEntries,
      totalSize,
      maxSize: this.config.maxCacheSize
    };
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<PerformanceConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

// Singleton instance
export const performanceOptimizer = new PerformanceOptimizer();

// React hook for performance optimization
export const usePerformanceOptimizer = () => {
  return {
    executeQuery: performanceOptimizer.executeQuery.bind(performanceOptimizer),
    getAnalytics: performanceOptimizer.getPerformanceAnalytics.bind(performanceOptimizer),
    clearCache: performanceOptimizer.clearCache.bind(performanceOptimizer),
    getCacheStats: performanceOptimizer.getCacheStats.bind(performanceOptimizer)
  };
};

// Database query optimization utilities
export const dbOptimizer = {
  /**
   * Optimize Supabase queries with caching
   */
  async optimizedQuery<T>(
    queryBuilder: any,
    cacheKey: string,
    options: { ttl?: number } = {}
  ): Promise<T> {
    return performanceOptimizer.executeQuery(
      cacheKey,
      async () => {
        const { data, error } = await queryBuilder;
        if (error) throw error;
        return data;
      },
      options
    );
  },

  /**
   * Batch multiple queries for better performance
   */
  async batchQueries<T>(
    queries: Array<{ key: string; query: () => Promise<T> }>,
    options: { ttl?: number } = {}
  ): Promise<Record<string, T>> {
    const results = await Promise.all(
      queries.map(({ key, query }) =>
        performanceOptimizer.executeQuery(key, query, options)
      )
    );
    
    const batchResult: Record<string, T> = {};
    queries.forEach(({ key }, index) => {
      batchResult[key] = results[index];
    });
    
    return batchResult;
  }
};

// Auto-scaling utilities
export const autoScaler = {
  /**
   * Monitor and adjust based on performance metrics
   */
  async monitorAndScale() {
    const analytics = performanceOptimizer.getPerformanceAnalytics();
    
    // Adjust cache settings based on performance
    if (analytics.averageExecutionTime > 2000 && analytics.cacheHitRate < 50) {
      performanceOptimizer.updateConfig({
        defaultTTL: 10 * 60 * 1000, // Increase cache time
        maxCacheSize: 2000 // Increase cache size
      });
    }
    
    // Clear cache if hit rate is very low
    if (analytics.cacheHitRate < 10 && analytics.totalQueries > 100) {
      performanceOptimizer.clearCache();
    }
    
    return {
      action: 'scaled',
      analytics,
      timestamp: Date.now()
    };
  }
};
