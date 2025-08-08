/*
 * AIKEYS FINANCIAL PLATFORM - EDGE FUNCTION: SECURITY EVENT LOGGER
 * © 2025 AIKEYS Financial Technologies. All Rights Reserved.
 * 
 * Real-time security event logging and analysis
 * Processes security events and triggers appropriate responses
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SecurityEventRequest {
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  metadata: any;
  blocked: boolean;
  user_id?: string;
  ip_address?: string;
  user_agent?: string;
  device_fingerprint?: string;
  location?: string;
  risk_score?: number;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const eventData: SecurityEventRequest = await req.json();

    // Extract IP address from request headers
    const ip = req.headers.get("x-forwarded-for") || 
               req.headers.get("x-real-ip") || 
               "unknown";

    // Extract user agent
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Calculate risk score based on event type and metadata
    const riskScore = calculateRiskScore(eventData);

    // Log the security event
    const { data: securityEvent, error: eventError } = await supabase
      .from('security_events')
      .insert({
        event_type: eventData.type,
        event_description: generateEventDescription(eventData),
        user_id: eventData.user_id || null,
        ip_address: eventData.ip_address || ip,
        user_agent: eventData.user_agent || userAgent,
        device_fingerprint: eventData.device_fingerprint,
        location: eventData.location,
        risk_score: riskScore,
        blocked: eventData.blocked,
        metadata: eventData.metadata || {}
      })
      .select()
      .single();

    if (eventError) {
      console.error("Failed to log security event:", eventError);
      throw eventError;
    }

    // Trigger automated response based on severity
    if (eventData.severity === 'critical' || eventData.severity === 'high') {
      await triggerAutomatedResponse(supabase, eventData, securityEvent);
    }

    // Update user security profile if applicable
    if (eventData.user_id) {
      await updateUserSecurityProfile(supabase, eventData.user_id, riskScore);
    }

    // Send alert to platform owner for critical events
    if (eventData.severity === 'critical') {
      await sendCriticalAlert(eventData, securityEvent);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      event_id: securityEvent.id,
      risk_score: riskScore,
      automated_response: eventData.severity === 'critical' || eventData.severity === 'high'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Security event logging error:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        details: "Failed to log security event"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

function calculateRiskScore(eventData: SecurityEventRequest): number {
  let score = 0;

  // Base score by event type
  const eventScores: Record<string, number> = {
    'FRAUD_DETECTED': 90,
    'IMPOSSIBLE_TRAVEL': 85,
    'DEVELOPER_TOOLS_DETECTED': 70,
    'CONSOLE_ACCESS_DETECTED': 65,
    'UNAUTHORIZED_DOMAIN_ACCESS': 95,
    'DOMAIN_MANIPULATION': 90,
    'RATE_LIMIT_EXCEEDED': 60,
    'SESSION_TIMEOUT': 20,
    'NEW_DEVICE': 40,
    'GEOLOCATION_BLOCKED': 30,
    'CONTEXT_MENU_BLOCKED': 15,
    'SECURITY_INITIALIZED': 0,
    'WEBAUTHN_READY': 0
  };

  score = eventScores[eventData.type] || 50;

  // Adjust based on severity
  const severityMultipliers = {
    'critical': 1.2,
    'high': 1.1,
    'medium': 1.0,
    'low': 0.8
  };

  score *= severityMultipliers[eventData.severity];

  // Adjust based on metadata
  if (eventData.metadata) {
    if (eventData.metadata.consecutiveFailures > 3) score += 20;
    if (eventData.metadata.botSignature) score += 30;
    if (eventData.metadata.automationDetected) score += 25;
    if (eventData.metadata.vpnDetected) score += 15;
  }

  return Math.min(Math.round(score), 100);
}

function generateEventDescription(eventData: SecurityEventRequest): string {
  const descriptions: Record<string, string> = {
    'FRAUD_DETECTED': 'Fraudulent activity pattern detected and blocked',
    'IMPOSSIBLE_TRAVEL': 'Geographically impossible user movement detected',
    'DEVELOPER_TOOLS_DETECTED': 'Unauthorized developer tools usage detected',
    'CONSOLE_ACCESS_DETECTED': 'Console tampering attempt blocked',
    'UNAUTHORIZED_DOMAIN_ACCESS': 'Access attempt from unauthorized domain',
    'DOMAIN_MANIPULATION': 'Domain manipulation attempt detected',
    'RATE_LIMIT_EXCEEDED': 'API rate limit exceeded - potential DoS attack',
    'SESSION_TIMEOUT': 'User session expired due to inactivity',
    'NEW_DEVICE': 'Login attempt from unrecognized device',
    'GEOLOCATION_BLOCKED': 'User blocked geolocation access',
    'CONTEXT_MENU_BLOCKED': 'Right-click context menu usage blocked',
    'SECURITY_INITIALIZED': 'Security monitoring system initialized',
    'WEBAUTHN_READY': 'WebAuthn biometric authentication ready'
  };

  return descriptions[eventData.type] || `Security event: ${eventData.type}`;
}

async function triggerAutomatedResponse(
  supabase: any, 
  eventData: SecurityEventRequest, 
  securityEvent: any
): Promise<void> {
  try {
    // Create automated incident response
    if (eventData.user_id) {
      // Step up authentication requirements
      await supabase
        .from('security_settings')
        .update({ 
          device_verification_required: true,
          session_timeout_minutes: 15 // Reduce session timeout
        })
        .eq('user_id', eventData.user_id);

      // Send notification to user
      await supabase.rpc('send_notification', {
        p_user_id: eventData.user_id,
        p_title: 'Security Alert',
        p_message: 'Unusual activity detected on your account. Enhanced security measures have been activated.',
        p_type: 'security',
        p_category: 'alert'
      });
    }

    // Log the automated response
    console.log(`Automated response triggered for ${eventData.type}:`, {
      event_id: securityEvent.id,
      user_id: eventData.user_id,
      severity: eventData.severity
    });

  } catch (error) {
    console.error("Failed to trigger automated response:", error);
  }
}

async function updateUserSecurityProfile(
  supabase: any, 
  userId: string, 
  riskScore: number
): Promise<void> {
  try {
    // Update user's risk profile
    const { error } = await supabase
      .from('profiles')
      .update({ 
        updated_at: new Date().toISOString(),
        // In a real implementation, we might store risk metrics
      })
      .eq('user_id', userId);

    if (error) {
      console.error("Failed to update user security profile:", error);
    }

  } catch (error) {
    console.error("Error updating user security profile:", error);
  }
}

async function sendCriticalAlert(
  eventData: SecurityEventRequest, 
  securityEvent: any
): Promise<void> {
  try {
    // Send critical alert to platform owner
    const alertResponse = await fetch('/api/send-security-alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        violationType: eventData.type,
        details: {
          ...eventData.metadata,
          event_id: securityEvent.id,
          risk_score: securityEvent.risk_score
        },
        timestamp: securityEvent.created_at,
        domain: eventData.metadata?.domain || 'unknown',
        userAgent: eventData.user_agent || 'unknown',
        severity: eventData.severity
      })
    });

    if (!alertResponse.ok) {
      console.error("Failed to send critical security alert");
    }

  } catch (error) {
    console.error("Error sending critical alert:", error);
  }
}

serve(handler);