import { logger } from './logger';

export interface ProviderScore {
  name: string;
  score: number;
  uptime: number;
  avgResponseTime: number;
  successRate: number;
  lastUpdated: string;
}

export interface ProviderMetrics {
  uptime: number;
  responseTime: number;
  successRate: number;
  corridors: string[];
}

export type ServiceType = 'onramp' | 'offramp' | 'payout' | 'iban' | 'cards';

class ProviderScoringEngine {
  private scores = new Map<string, ProviderScore>();
  private preferences: Record<ServiceType, string[]> = {
    onramp: ['TRANSAK', 'GUARDARIAN'],
    offramp: ['GUARDARIAN', 'TRANSAK'],
    payout: ['NIUM', 'OPENPAYD'],
    iban: ['OPENPAYD', 'NIUM'],
    cards: ['NIUM']
  };

  constructor() {
    // Initialize with default scores
    this.initializeDefaultScores();
  }

  private initializeDefaultScores() {
    const defaultProviders = [
      { name: 'TRANSAK', score: 0.95, uptime: 99.5, avgResponseTime: 250, successRate: 94.2 },
      { name: 'GUARDARIAN', score: 0.92, uptime: 99.2, avgResponseTime: 320, successRate: 91.8 },
      { name: 'NIUM', score: 0.94, uptime: 99.8, avgResponseTime: 180, successRate: 96.1 },
      { name: 'OPENPAYD', score: 0.93, uptime: 99.6, avgResponseTime: 200, successRate: 95.3 }
    ];

    defaultProviders.forEach(provider => {
      this.scores.set(provider.name, {
        ...provider,
        lastUpdated: new Date().toISOString()
      });
    });
  }

  updateProviderMetrics(providerName: string, metrics: ProviderMetrics) {
    const log = logger.child({ provider: providerName, method: 'updateProviderMetrics' });
    
    // Calculate composite score based on multiple factors
    const uptimeWeight = 0.4;
    const responseTimeWeight = 0.3;
    const successRateWeight = 0.3;

    // Normalize response time (lower is better, max acceptable is 1000ms)
    const normalizedResponseTime = Math.max(0, (1000 - metrics.responseTime) / 1000);
    
    const score = (
      (metrics.uptime / 100) * uptimeWeight +
      normalizedResponseTime * responseTimeWeight +
      (metrics.successRate / 100) * successRateWeight
    );

    const providerScore: ProviderScore = {
      name: providerName,
      score: Math.round(score * 1000) / 1000, // Round to 3 decimal places
      uptime: metrics.uptime,
      avgResponseTime: metrics.responseTime,
      successRate: metrics.successRate,
      lastUpdated: new Date().toISOString()
    };

    this.scores.set(providerName, providerScore);
    
    log.info({ score: providerScore.score, metrics }, 'Updated provider metrics');
  }

  getBestProvider(serviceType: ServiceType, corridor?: string): string {
    const availableProviders = this.preferences[serviceType] || [];
    
    if (availableProviders.length === 0) {
      throw new Error(`No providers available for service type: ${serviceType}`);
    }

    // Sort by score descending
    const sortedProviders = availableProviders
      .map(name => ({ name, score: this.scores.get(name)?.score || 0 }))
      .sort((a, b) => b.score - a.score);

    const bestProvider = sortedProviders[0];
    
    logger.info({
      serviceType,
      corridor,
      selectedProvider: bestProvider.name,
      score: bestProvider.score,
      alternatives: sortedProviders.slice(1)
    }, 'Selected best provider');

    return bestProvider.name;
  }

  getProviderScore(providerName: string): ProviderScore | null {
    return this.scores.get(providerName) || null;
  }

  getAllProviderScores(): ProviderScore[] {
    return Array.from(this.scores.values());
  }

  getFailoverProvider(serviceType: ServiceType, excludeProvider: string): string | null {
    const availableProviders = this.preferences[serviceType] || [];
    const fallbackProviders = availableProviders.filter(name => name !== excludeProvider);
    
    if (fallbackProviders.length === 0) {
      return null;
    }

    const sortedFallbacks = fallbackProviders
      .map(name => ({ name, score: this.scores.get(name)?.score || 0 }))
      .sort((a, b) => b.score - a.score);

    const fallbackProvider = sortedFallbacks[0];
    
    logger.info({
      serviceType,
      excludedProvider: excludeProvider,
      fallbackProvider: fallbackProvider.name,
      score: fallbackProvider.score
    }, 'Selected failover provider');

    return fallbackProvider.name;
  }

  setProviderPreference(serviceType: ServiceType, providers: string[]) {
    this.preferences[serviceType] = providers;
    logger.info({ serviceType, providers }, 'Updated provider preferences');
  }

  isProviderHealthy(providerName: string, minScore = 0.8): boolean {
    const score = this.scores.get(providerName);
    return score ? score.score >= minScore : false;
  }
}

// Export singleton instance
export const providerScoring = new ProviderScoringEngine();

// Utility functions
export function chooseProvider(serviceType: ServiceType, corridor?: string): string {
  return providerScoring.getBestProvider(serviceType, corridor);
}

export function getFailoverProvider(serviceType: ServiceType, excludeProvider: string): string | null {
  return providerScoring.getFailoverProvider(serviceType, excludeProvider);
}

export function updateProviderHealth(providerName: string, isHealthy: boolean, responseTime = 0) {
  const currentScore = providerScoring.getProviderScore(providerName);
  if (!currentScore) return;

  const metrics: ProviderMetrics = {
    uptime: isHealthy ? Math.min(100, currentScore.uptime + 0.1) : Math.max(0, currentScore.uptime - 1),
    responseTime: responseTime || currentScore.avgResponseTime,
    successRate: isHealthy ? Math.min(100, currentScore.successRate + 0.1) : Math.max(0, currentScore.successRate - 1),
    corridors: [] // Placeholder
  };

  providerScoring.updateProviderMetrics(providerName, metrics);
}