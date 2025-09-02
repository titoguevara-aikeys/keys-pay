// Webhook processing utilities and retry logic
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface WebhookRetryConfig {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  exponentialBase: number;
}

export const DEFAULT_RETRY_CONFIG: WebhookRetryConfig = {
  maxRetries: 5,
  baseDelayMs: 1000,
  maxDelayMs: 300000, // 5 minutes
  exponentialBase: 2,
};

export class WebhookProcessor {
  private config: WebhookRetryConfig;

  constructor(config: WebhookRetryConfig = DEFAULT_RETRY_CONFIG) {
    this.config = config;
  }

  async processWithRetry<T>(
    eventId: string,
    provider: string,
    processor: () => Promise<T>
  ): Promise<{ success: boolean; result?: T; error?: string }> {
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const result = await processor();
        
        // Update success status
        await this.updateWebhookStatus(eventId, provider, true, null, attempt);
        
        return { success: true, result };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        if (attempt < this.config.maxRetries) {
          const delayMs = this.calculateDelay(attempt);
          console.log(`Webhook ${eventId} attempt ${attempt + 1} failed, retrying in ${delayMs}ms:`, lastError.message);
          
          await this.updateWebhookStatus(eventId, provider, false, lastError.message, attempt);
          await this.delay(delayMs);
        }
      }
    }

    // All retries exhausted
    console.error(`Webhook ${eventId} failed after ${this.config.maxRetries + 1} attempts:`, lastError?.message);
    await this.updateWebhookStatus(eventId, provider, false, lastError?.message || 'Unknown error', this.config.maxRetries);
    
    return { success: false, error: lastError?.message || 'Unknown error' };
  }

  private calculateDelay(attempt: number): number {
    const delay = this.config.baseDelayMs * Math.pow(this.config.exponentialBase, attempt);
    return Math.min(delay, this.config.maxDelayMs);
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async updateWebhookStatus(
    eventId: string,
    provider: string,
    processed: boolean,
    errorMessage: string | null,
    retryCount: number
  ): Promise<void> {
    try {
      await supabaseAdmin
        .from('webhook_events_v2')
        .update({
          processed,
          processed_at: processed ? new Date().toISOString() : null,
          error_message: errorMessage,
          retry_count: retryCount,
          last_retry_at: new Date().toISOString(),
        })
        .eq('event_id', eventId)
        .eq('provider', provider);
    } catch (updateError) {
      console.error('Failed to update webhook status:', updateError);
    }
  }
}

// Webhook event queue for background processing
export class WebhookQueue {
  private static instance: WebhookQueue;
  private processor: WebhookProcessor;

  private constructor() {
    this.processor = new WebhookProcessor();
  }

  static getInstance(): WebhookQueue {
    if (!WebhookQueue.instance) {
      WebhookQueue.instance = new WebhookQueue();
    }
    return WebhookQueue.instance;
  }

  async enqueueFailedWebhooks(): Promise<void> {
    try {
      // Find failed webhooks that haven't been retried recently
      const { data: failedWebhooks, error } = await supabaseAdmin
        .from('webhook_events_v2')
        .select('*')
        .eq('processed', false)
        .lt('retry_count', DEFAULT_RETRY_CONFIG.maxRetries)
        .or(`last_retry_at.is.null,last_retry_at.lt.${new Date(Date.now() - 60000).toISOString()}`) // Not retried in last minute
        .limit(10);

      if (error) {
        console.error('Failed to fetch failed webhooks:', error);
        return;
      }

      if (!failedWebhooks || failedWebhooks.length === 0) {
        return;
      }

      console.log(`Found ${failedWebhooks.length} failed webhooks to retry`);

      // Process each failed webhook
      for (const webhook of failedWebhooks) {
        await this.retryWebhook(webhook);
      }
    } catch (error) {
      console.error('Error in webhook queue processing:', error);
    }
  }

  private async retryWebhook(webhook: any): Promise<void> {
    const { event_id: eventId, provider, raw_payload: payload } = webhook;
    
    try {
      // Re-process based on provider
      switch (provider) {
        case 'guardarian':
          await this.retryGuardarianWebhook(eventId, payload);
          break;
        case 'nymcard':
          await this.retryNymCardWebhook(eventId, payload);
          break;
        case 'wio':
          await this.retryWioWebhook(eventId, payload);
          break;
        case 'ramp':
          await this.retryRampWebhook(eventId, payload);
          break;
        default:
          console.warn(`Unknown provider for retry: ${provider}`);
      }
    } catch (error) {
      console.error(`Failed to retry ${provider} webhook ${eventId}:`, error);
    }
  }

  private async retryGuardarianWebhook(eventId: string, payload: any): Promise<void> {
    // Re-implement Guardarian webhook processing logic here
    console.log(`Retrying Guardarian webhook: ${eventId}`);
  }

  private async retryNymCardWebhook(eventId: string, payload: any): Promise<void> {
    // Re-implement NymCard webhook processing logic here
    console.log(`Retrying NymCard webhook: ${eventId}`);
  }

  private async retryWioWebhook(eventId: string, payload: any): Promise<void> {
    // Re-implement Wio webhook processing logic here
    console.log(`Retrying Wio webhook: ${eventId}`);
  }

  private async retryRampWebhook(eventId: string, payload: any): Promise<void> {
    // Re-implement Ramp webhook processing logic here
    console.log(`Retrying Ramp webhook: ${eventId}`);
  }
}

// Webhook monitoring and metrics
export async function getWebhookMetrics(timeRangeHours: number = 24) {
  const since = new Date(Date.now() - timeRangeHours * 60 * 60 * 1000).toISOString();
  
  const { data: webhooks, error } = await supabaseAdmin
    .from('webhook_events_v2')
    .select('provider, processed, created_at, retry_count')
    .gte('created_at', since);

  if (error) {
    throw new Error(`Failed to fetch webhook metrics: ${error.message}`);
  }

  const metrics = {
    total: webhooks?.length || 0,
    processed: webhooks?.filter(w => w.processed).length || 0,
    failed: webhooks?.filter(w => !w.processed).length || 0,
    retried: webhooks?.filter(w => w.retry_count > 0).length || 0,
    byProvider: {} as Record<string, { total: number; processed: number; failed: number }>,
  };

  // Calculate per-provider metrics
  webhooks?.forEach(webhook => {
    const provider = webhook.provider;
    if (!metrics.byProvider[provider]) {
      metrics.byProvider[provider] = { total: 0, processed: 0, failed: 0 };
    }
    
    metrics.byProvider[provider].total++;
    if (webhook.processed) {
      metrics.byProvider[provider].processed++;
    } else {
      metrics.byProvider[provider].failed++;
    }
  });

  return metrics;
}