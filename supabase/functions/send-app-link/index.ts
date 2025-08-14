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
  apkUrl?: string;
  setupRequired?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, appUrl, apkUrl, setupRequired }: SendLinkRequest = await req.json();

    console.log(`Sending app link to: ${email}`);

    const emailResponse = await resend.emails.send({
      from: "AIKEYS Wallet <onboarding@resend.dev>",
      to: [email],
      subject: apkUrl ? "AIKEYS Wallet - APK Download Ready!" : "AIKEYS Wallet - Setup Required for APK Download",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a1a; margin-bottom: 20px;">📱 AIKEYS Wallet App Download</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Hi! Here's your AIKEYS Wallet app download:
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            ${apkUrl ? `
              <h3 style="margin: 0 0 15px 0; color: #22c55e;">✅ APK Download Ready!</h3>
              <a href="${apkUrl}" style="display: inline-block; background: #22c55e; color: white; padding: 15px 30px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 10px; font-size: 16px;">📱 Download APK Now</a>
              <p style="margin: 10px 0 0 0; font-size: 14px; color: #666;">Click to download and install the AIKEYS Wallet app on your Android device</p>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">Compatible with Android 8.0+ • File size: ~15MB</p>
            ` : `
              <h3 style="margin: 0 0 15px 0; color: #ef4444;">❌ APK Download Not Available</h3>
              <div style="background: #fef2f2; border: 2px solid #ef4444; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #dc2626;">🔧 GitHub Releases Setup Required</h4>
                <p style="margin: 0 0 15px 0; color: #7f1d1d; font-weight: bold;">
                  The APK build system is not configured yet. You need to:
                </p>
                <ol style="text-align: left; margin: 0; padding-left: 20px; color: #7f1d1d; font-size: 14px;">
                  <li>Export your project to GitHub</li>
                  <li>Add 4 Android signing secrets</li>
                  <li>Update the GitHub repo URL in your code</li>
                  <li>Push to main branch to trigger the first build</li>
                </ol>
              </div>
              <a href="${appUrl}/mobile-app" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 10px;">📋 View Setup Guide</a>
              <br>
              <a href="${appUrl}" style="display: inline-block; background: #6b7280; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 10px;">🌐 Use Web App Meanwhile</a>
              <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Setup takes ~10 minutes. Once complete, you'll get direct APK download links!</p>
            `}
          </div>
          
          <h3 style="color: #1a1a1a; margin-top: 30px;">🧪 Features to Test:</h3>
          <ul style="line-height: 1.8; color: #333; text-align: left;">
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
            This email was sent from your AIKEYS Wallet testing system. Once GitHub releases are configured, you'll receive direct APK download links.
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