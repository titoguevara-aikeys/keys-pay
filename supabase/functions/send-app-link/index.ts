import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SendLinkRequest {
  email: string;
  appUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, appUrl }: SendLinkRequest = await req.json();

    console.log(`Sending app link to: ${email}`);

    const emailResponse = await resend.emails.send({
      from: "AIKEYS Wallet <security@aikeys-hub.com>",
      to: [email],
      subject: "AIKEYS Wallet - Test Advanced Security Features",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; margin-bottom: 20px;">🔐 AIKEYS Wallet Security Testing</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Hi! Here's your AIKEYS Wallet app link for testing the advanced security features:
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #1a1a1a;">🔗 App Link:</h3>
            <a href="${appUrl}" style="color: #2563eb; font-weight: bold; text-decoration: none; font-size: 18px;">${appUrl}</a>
          </div>
          
          <h3 style="color: #1a1a1a; margin-top: 30px;">🧪 Security Features to Test:</h3>
          <ul style="line-height: 1.8; color: #333;">
            <li><strong>Two-Factor Authentication (2FA)</strong> - Set up and verify with authenticator app</li>
            <li><strong>Biometric Authentication</strong> - Test fingerprint/face recognition</li>
            <li><strong>Device Management</strong> - View and manage trusted devices</li>
            <li><strong>Fraud Monitoring</strong> - Real-time security alerts and blocking</li>
            <li><strong>Security Audit Log</strong> - Review all security events and activities</li>
          </ul>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>📱 Testing Tips:</strong> Use a different device/browser to trigger security events and see the fraud detection in action!
            </p>
          </div>
          
          <p style="font-size: 14px; color: #666; margin-top: 30px;">
            Navigate to <strong>/security</strong> after logging in to access all advanced security features.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="font-size: 12px; color: #888;">
            This email was sent from your AIKEYS Wallet security testing system.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id,
      message: "App link sent successfully" 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-app-link function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);