import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SecurityAlertRequest {
  violationType: string;
  details: any;
  timestamp: string;
  domain: string;
  userAgent: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const alertData: SecurityAlertRequest = await req.json();

    // Owner contact emails (secured)
    const ownerEmails = [
      'tito.guevara@aikeys.ai',
      'tito.guevara@gmail.com'
    ];

    const severityIcons = {
      critical: '🚨',
      high: '⚠️',
      medium: '⚡',
      low: 'ℹ️'
    };

    const emailResponse = await resend.emails.send({
      from: "AIKEYS Security <security@aikeys.ai>",
      to: ownerEmails,
      subject: `${severityIcons[alertData.severity]} AIKEYS Platform Security Alert - ${alertData.violationType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 20px; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ff4444; font-size: 28px; margin: 0;">🚨 SECURITY BREACH DETECTED</h1>
            <p style="color: #ff6666; font-size: 16px; margin: 5px 0;">AIKEYS Financial Platform</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #ff4444; margin-top: 0;">Violation Details</h2>
            <p><strong>Type:</strong> ${alertData.violationType}</p>
            <p><strong>Severity:</strong> <span style="color: ${alertData.severity === 'critical' ? '#ff4444' : alertData.severity === 'high' ? '#ff8800' : '#ffaa00'}">${alertData.severity.toUpperCase()}</span></p>
            <p><strong>Domain:</strong> ${alertData.domain}</p>
            <p><strong>Timestamp:</strong> ${alertData.timestamp}</p>
            <p><strong>User Agent:</strong> ${alertData.userAgent}</p>
          </div>
          
          <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #ffaa00; margin-top: 0;">Technical Details</h3>
            <pre style="background: #1a1a1a; padding: 15px; border-radius: 5px; font-size: 12px; overflow-x: auto;">${JSON.stringify(alertData.details, null, 2)}</pre>
          </div>
          
          <div style="background: #330000; border: 2px solid #ff4444; padding: 15px; border-radius: 8px;">
            <h3 style="color: #ff4444; margin-top: 0;">⚠️ IMMEDIATE ACTION REQUIRED</h3>
            <p>Someone is attempting to compromise your AIKEYS platform. This alert was automatically generated when unauthorized access patterns were detected.</p>
            <p><strong>Recommended Actions:</strong></p>
            <ul>
              <li>Monitor your platform for unusual activity</li>
              <li>Review access logs</li>
              <li>Consider implementing additional security measures</li>
              <li>Contact legal team if intellectual property theft is suspected</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding: 15px; border-top: 1px solid #444;">
            <p style="font-size: 12px; color: #888;">
              This is an automated security alert from AIKEYS Financial Platform<br>
              © 2025 AIKEYS Financial Technologies. All Rights Reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Security alert sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Security alert sent",
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending security alert:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);