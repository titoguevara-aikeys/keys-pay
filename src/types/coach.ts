import { z } from "zod";

export const ShariahFlagEnum = z.enum(["riba", "gharar", "maysir"]);

export const ShariahModeSchema = z.object({
  compatible: z.boolean(),
  notesEN: z.string().default(""),
  notesAR: z.string().default(""),
  prohibitedFlags: z.array(ShariahFlagEnum).default([]),
  alternativeEN: z.string().default(""),
  alternativeAR: z.string().default("")
});

export const LessonSchema = z.object({
  id: z.string().min(3),
  track: z.string(),
  lessonNumber: z.number().int().positive(),
  titleEN: z.string(),
  titleAR: z.string(),
  trigger: z.string(),
  copyEN: z.string(),
  copyAR: z.string(),
  ctaEN: z.string(),
  ctaAR: z.string(),
  primaryMetric: z.string(),
  shariahMode: ShariahModeSchema
});

export const LessonsArraySchema = z.array(LessonSchema).min(1);

export type ShariahMode = z.infer<typeof ShariahModeSchema>;
export type Lesson = z.infer<typeof LessonSchema>;

export type FeedItem = {
  id: string;
  track: string;
  title: string;
  copy: string;
  cta: string;
  shariah?: {
    compatible: boolean;
    notes?: string;
    alternative?: string;
    flags?: string[];
  };
};
