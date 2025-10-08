import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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

    const { lang = 'en' } = await req.json().catch(() => ({ lang: 'en' }));
    const isArabic = lang === 'ar';

    // Fetch active lessons
    const { data: lessons, error: lessonsError } = await supabaseClient
      .from('financial_lessons')
      .select('*')
      .eq('is_active', true)
      .order('track', { ascending: true })
      .order('lesson_number', { ascending: true });

    if (lessonsError) throw lessonsError;

    // Fetch user's progress
    const { data: progress } = await supabaseClient
      .from('user_lesson_progress')
      .select('lesson_id, completed, action_taken')
      .eq('user_id', user.id);

    const progressMap = new Map(
      (progress || []).map(p => [p.lesson_id, p])
    );

    // Transform lessons to feed items
    const feed = (lessons || []).map(lesson => ({
      id: lesson.id,
      track: lesson.track,
      title: isArabic ? lesson.title_ar : lesson.title_en,
      copy: isArabic ? lesson.copy_ar : lesson.copy_en,
      cta: isArabic ? lesson.cta_ar : lesson.cta_en,
      shariah: {
        compatible: lesson.shariah_compatible,
        notes: isArabic ? lesson.shariah_notes_ar : lesson.shariah_notes_en,
        alternative: isArabic ? lesson.shariah_alternative_ar : lesson.shariah_alternative_en,
        flags: lesson.shariah_prohibited_flags || []
      },
      progress: progressMap.get(lesson.id) || { completed: false, action_taken: false }
    }));

    return new Response(JSON.stringify({ feed }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in coach-feed:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
