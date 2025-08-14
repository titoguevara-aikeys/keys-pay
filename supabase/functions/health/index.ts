import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const startTime = Date.now();
    
    // Check database connectivity
    const { data: dbCheck, error: dbError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (dbError) {
      throw new Error(`Database connectivity failed: ${dbError.message}`);
    }

    // Check required secrets
    const secrets = {
      CIRCLE_API_KEY: !!Deno.env.get('CIRCLE_API_KEY'),
      CIRCLE_WEBHOOK_SECRET: !!Deno.env.get('CIRCLE_WEBHOOK_SECRET'),
      ALERT_EMAIL: !!Deno.env.get('ALERT_EMAIL'),
    };

    // Get webhook health metrics
    const { data: webhookHealth } = await supabase
      .rpc('webhook_health_check');

    // Get recent security events
    const { data: securityEvents, error: securityError } = await supabase
      .from('security_events')
      .select('event_type, risk_score')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .limit(10);

    const highRiskEvents = securityEvents?.filter(e => e.risk_score > 70) || [];

    const dbLatency = Date.now() - startTime;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: !dbError,
        latency_ms: dbLatency
      },
      secrets: secrets,
      webhooks: webhookHealth || { status: 'unknown' },
      security: {
        recentHighRiskEvents: highRiskEvents.length,
        last24Hours: securityEvents?.length || 0
      },
      version: '1.0.0'
    };

    // Determine overall health
    const isHealthy = !dbError && 
                     secrets.CIRCLE_WEBHOOK_SECRET && 
                     dbLatency < 1000 &&
                     highRiskEvents.length < 10;

    return new Response(JSON.stringify({
      ...healthStatus,
      status: isHealthy ? 'healthy' : 'degraded'
    }), {
      status: isHealthy ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Health check failed:', error);
    
    return new Response(JSON.stringify({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
};

serve(handler);