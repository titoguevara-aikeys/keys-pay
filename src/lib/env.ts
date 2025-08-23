// Environment configuration with validation
// Server-only variables should never be exposed to client

export const env = {
  // Client-safe variables
  APP_ENV: import.meta.env.VITE_APP_ENV || "staging",
  BASE_URL: import.meta.env.VITE_BASE_URL || window.location.origin,
  
  // Feature flags
  FEATURE_OPENPAYD: import.meta.env.VITE_FEATURE_OPENPAYD === "true",
  FEATURE_RAMP: import.meta.env.VITE_FEATURE_RAMP !== "false", 
  FEATURE_NIUM: import.meta.env.VITE_FEATURE_NIUM !== "false",
} as const;

// Server-only environment (for API routes)
// Only access process.env if we're in a Node.js environment
export const serverEnv = typeof process !== 'undefined' ? {
  VERCEL_PROJECT_ID: process.env.VERCEL_PROJECT_ID,
  VERCEL_TEAM_ID: process.env.VERCEL_TEAM_ID || "",
  VERCEL_TOKEN: process.env.VERCEL_TOKEN,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  NIUM_API_KEY: process.env.NIUM_API_KEY,
  RAMP_API_KEY: process.env.RAMP_API_KEY,
  OPENPAYD_API_KEY: process.env.OPENPAYD_API_KEY,
} : {} as const;

// Validation for required client variables
const requiredClientVars = ['BASE_URL'] as const;
requiredClientVars.forEach(key => {
  if (!env[key as keyof typeof env]) {
    console.warn(`Missing client environment variable: VITE_${key}`);
  }
});

// Server validation function (call in API routes)
export function validateServerEnv(required: (keyof typeof serverEnv)[] = []) {
  const missing = required.filter(key => !serverEnv[key]);
  if (missing.length > 0) {
    throw new Error(`Missing server environment variables: ${missing.join(', ')}`);
  }
}