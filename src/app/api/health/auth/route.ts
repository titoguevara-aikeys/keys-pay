import { supabase } from "@/integrations/supabase/client";

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Test auth endpoint connectivity (no sensitive data)
    const { data: { session }, error } = await supabase.auth.getSession();
    
    const latencyMs = Date.now() - startTime;
    
    if (error && error.message !== "Auth session missing!") {
      return Response.json({
        ok: false,
        latencyMs,
        error: error.message
      }, { status: 503 });
    }
    
    return Response.json({
      ok: true,
      latencyMs,
      message: "Auth service connectivity verified",
      hasSession: !!session
    });
    
  } catch (error: any) {
    return Response.json({
      ok: false,
      latencyMs: Date.now() - startTime,
      error: error.message
    }, { status: 503 });
  }
}