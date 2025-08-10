import { z } from 'zod';

// AI Chat message validation
export const ChatMessageSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message too long')
    .refine(msg => !msg.includes('<script'), 'Invalid characters detected'),
  sessionId: z.string().uuid().optional(),
  context: z.object({
    insights: z.array(z.any()).optional(),
    healthScore: z.any().optional(),
    userProfile: z.object({
      riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).optional(),
      age: z.number().min(18).max(120).optional(),
      goals: z.array(z.string()).optional()
    }).optional()
  }).optional()
});

// Financial insight validation
export const InsightSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(1000),
  type: z.enum(['savings', 'investment', 'debt', 'spending', 'income']),
  priority: z.enum(['low', 'medium', 'high']),
  confidence: z.number().min(0).max(1),
  actionItems: z.array(z.string()).optional(),
  estimatedImpact: z.number().optional()
});

// User input validation for forms
export const UserInputSchema = z.object({
  query: z.string().max(1000),
  amount: z.number().positive().optional(),
  category: z.string().max(100).optional(),
  date: z.string().datetime().optional()
});

// Voice settings validation
export const VoiceSettingsSchema = z.object({
  voice: z.enum(['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer']),
  enabled: z.boolean(),
  autoPlay: z.boolean().optional()
});

// API key validation (for admin functions)
export const APIKeySchema = z.object({
  key: z.string()
    .min(32, 'API key too short')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Invalid API key format')
});

// Helper function to safely validate and return data
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
}