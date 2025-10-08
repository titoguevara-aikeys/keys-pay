import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LessonSchema = z.object({
  id: z.string().min(3),
  track: z.string(),
  lesson_number: z.number().int().positive(),
  title_en: z.string(),
  title_ar: z.string(),
  trigger: z.string(),
  copy_en: z.string(),
  copy_ar: z.string(),
  cta_en: z.string(),
  cta_ar: z.string(),
  primary_metric: z.string(),
  shariah_compatible: z.boolean(),
  shariah_notes_en: z.string().optional(),
  shariah_notes_ar: z.string().optional(),
  shariah_prohibited_flags: z.array(z.enum(["riba", "gharar", "maysir"])).optional(),
  shariah_alternative_en: z.string().optional(),
  shariah_alternative_ar: z.string().optional()
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if user is admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Verify admin status
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!profile || !['admin', 'super_admin', 'moderator'].includes(profile.role)) {
      throw new Error('Admin access required');
    }

    const body = await req.json();
    const { lessons } = body;

    if (!Array.isArray(lessons)) {
      throw new Error('Lessons must be an array');
    }

    // Validate all lessons
    const validatedLessons = lessons.map(lesson => LessonSchema.parse(lesson));

    // Upsert lessons
    const { data, error } = await supabaseClient
      .from('financial_lessons')
      .upsert(validatedLessons, { onConflict: 'id' });

    if (error) throw error;

    return new Response(JSON.stringify({ 
      success: true,
      count: validatedLessons.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in coach-ingest:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
