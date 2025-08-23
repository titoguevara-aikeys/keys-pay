import { supabase } from "@/integrations/supabase/client";

export async function GET() {
  const startTime = Date.now();
  
  try {
    // Simple connectivity test
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    const latencyMs = Date.now() - startTime;
    
    if (error) {
      return Response.json({
        ok: false,
        latencyMs,
        error: error.message
      }, { status: 503 });
    }
    
    return Response.json({
      ok: true,
      latencyMs,
      message: "Database connectivity verified"
    });
    
  } catch (error: any) {
    return Response.json({
      ok: false,
      latencyMs: Date.now() - startTime,
      error: error.message
    }, { status: 503 });
  }
}