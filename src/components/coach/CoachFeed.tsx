import React, { useEffect, useState } from "react";
import { CoachCard } from "./CoachCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import type { FeedItem } from "@/types/coach";
import { useTranslation } from "react-i18next";

interface CoachFeedProps {
  shariahMode?: boolean;
}

export const CoachFeed: React.FC<CoachFeedProps> = ({ shariahMode = true }) => {
  const [lessons, setLessons] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  useEffect(() => {
    fetchLessons();
  }, [isArabic]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from("financial_lessons")
        .select("*")
        .eq("is_active", true)
        .order("track", { ascending: true })
        .order("lesson_number", { ascending: true });

      if (error) throw error;

      const transformedLessons: FeedItem[] = (data || []).map((lesson) => ({
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
        }
      }));

      setLessons(transformedLessons);
    } catch (error) {
      console.error("Error fetching lessons:", error);
      toast({
        title: "Error",
        description: "Failed to load financial lessons",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (lessonId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to track your progress",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from("user_lesson_progress")
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          action_taken: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: "user_id,lesson_id"
        });

      if (error) throw error;

      toast({
        title: "Action recorded",
        description: "Your progress has been saved",
      });
    } catch (error) {
      console.error("Error recording action:", error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {isArabic ? "دروس مالية" : "Financial Lessons"}
        </h2>
        {shariahMode && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            {isArabic ? "وضع الشريعة مفعّل" : "Shariah Mode Active"}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <CoachCard
            key={lesson.id}
            title={lesson.title}
            copy={lesson.copy}
            cta={lesson.cta}
            shariah={shariahMode ? lesson.shariah : undefined}
            onAction={() => handleAction(lesson.id)}
          />
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {isArabic ? "لا توجد دروس متاحة حالياً" : "No lessons available at the moment"}
          </p>
        </div>
      )}
    </div>
  );
};

import { CheckCircle } from "lucide-react";
