/*
 * AIKEYS FINANCIAL PLATFORM - SECURITY ALERTING SYSTEM
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * AUTOMATED SECURITY EVENT ALERTING
 * Handles real-time security event processing and alerting
 */

import { supabase } from '@/integrations/supabase/client';

export interface SecurityAlertConfig {
  enabled: boolean;
  emailAlerts: boolean;
  slackWebhook?: string;
  thresholds: {
    critical: number;
    high: number;
    medium: number;
  };
}

export interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  highRiskEvents: number;
  blockedEvents: number;
  recentEvents: number;
  securityScore: number;
}

export class SecurityAlerting {
  private config: SecurityAlertConfig;
  private metrics: SecurityMetrics;

  constructor(config: SecurityAlertConfig) {
    this.config = config;
    this.metrics = {
      totalEvents: 0,
      criticalEvents: 0,
      highRiskEvents: 0,
      blockedEvents: 0,
      recentEvents: 0,
      securityScore: 100
    };
  }

  async processSecurityEvent(event: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    metadata: any;
    userId?: string;
    ipAddress?: string;
  }) {
    try {
      // Update metrics
      this.updateMetrics(event);

      // Log to Supabase security events
      await this.logSecurityEvent(event);

      // Check if alert thresholds are exceeded
      if (this.shouldAlert(event)) {
        await this.sendSecurityAlert(event);
      }

      // Update security score
      this.updateSecurityScore(event);

      return { success: true };
    } catch (error) {
      console.error('Failed to process security event:', error);
      return { success: false, error };
    }
  }

  private updateMetrics(event: any) {
    this.metrics.totalEvents++;
    this.metrics.recentEvents++;

    switch (event.severity) {
      case 'critical':
        this.metrics.criticalEvents++;
        break;
      case 'high':
        this.metrics.highRiskEvents++;
        break;
    }

    if (event.metadata?.blocked) {
      this.metrics.blockedEvents++;
    }

    // Reset recent events counter every hour
    setTimeout(() => {
      this.metrics.recentEvents = Math.max(0, this.metrics.recentEvents - 1);
    }, 60 * 60 * 1000);
  }

  private async logSecurityEvent(event: any) {
    try {
      const { error } = await supabase.functions.invoke('log-security-event', {
        body: {
          event_type: event.type,
          event_description: this.generateEventDescription(event),
          user_id: event.userId || null,
          ip_address: event.ipAddress || null,
          risk_score: this.calculateRiskScore(event),
          blocked: event.metadata?.blocked || false,
          metadata: event.metadata
        }
      });

      if (error) {
        console.error('Failed to log security event to Supabase:', error);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  private shouldAlert(event: any): boolean {
    if (!this.config.enabled) return false;

    const thresholds = this.config.thresholds;
    
    // Always alert on critical events
    if (event.severity === 'critical') return true;
    
    // Alert if recent events exceed thresholds
    if (event.severity === 'high' && this.metrics.recentEvents >= thresholds.high) return true;
    if (event.severity === 'medium' && this.metrics.recentEvents >= thresholds.medium) return true;

    return false;
  }

  private async sendSecurityAlert(event: any) {
    if (!this.config.emailAlerts) return;

    try {
      const { error } = await supabase.functions.invoke('send-security-alert', {
        body: {
          event_type: event.type,
          severity: event.severity,
          message: this.generateEventDescription(event),
          metadata: event.metadata,
          timestamp: new Date().toISOString(),
          metrics: this.metrics
        }
      });

      if (error) {
        console.error('Failed to send security alert:', error);
      }
    } catch (error) {
      console.error('Error sending security alert:', error);
    }
  }

  private generateEventDescription(event: any): string {
    const descriptions = {
      'RATE_LIMIT_EXCEEDED': `Rate limit exceeded: ${event.metadata?.violations || 1} violations`,
      'SUSPICIOUS_LOGIN': 'Suspicious login attempt detected',
      'API_KEY_INVALID': 'Invalid API key usage detected',
      'CSRF_TOKEN_MISMATCH': 'CSRF token validation failed',
      'MULTIPLE_FAILED_LOGINS': 'Multiple failed login attempts',
      'UNUSUAL_LOCATION': 'Login from unusual location',
      'BRUTE_FORCE_ATTEMPT': 'Brute force attack detected'
    };

    return descriptions[event.type as keyof typeof descriptions] || `Security event: ${event.type}`;
  }

  private calculateRiskScore(event: any): number {
    const baseScores = {
      'low': 10,
      'medium': 30,
      'high': 60,
      'critical': 90
    };

    let score = baseScores[event.severity as keyof typeof baseScores] || 10;

    // Adjust based on metadata
    if (event.metadata?.violations > 1) {
      score += Math.min(event.metadata.violations * 5, 20);
    }

    if (event.metadata?.blocked) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  private updateSecurityScore(event: any) {
    const impact = {
      'low': -1,
      'medium': -3,
      'high': -5,
      'critical': -10
    };

    this.metrics.securityScore = Math.max(0, 
      this.metrics.securityScore + (impact[event.severity as keyof typeof impact] || 0)
    );
  }

  getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  updateConfig(newConfig: Partial<SecurityAlertConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}

// Default security alerting instance
export const securityAlerting = new SecurityAlerting({
  enabled: true,
  emailAlerts: true,
  thresholds: {
    critical: 1,  // Alert immediately on critical events
    high: 5,      // Alert after 5 high-severity events
    medium: 20    // Alert after 20 medium-severity events
  }
});