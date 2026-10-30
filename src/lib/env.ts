import { z } from 'zod';

const clientEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url('VITE_SUPABASE_URL must be a valid URL'),
  VITE_SUPABASE_ANON_KEY: z.string().min(20, 'VITE_SUPABASE_ANON_KEY must be a valid token string'),
  VITE_SITE_NAME: z.string().min(1).default('दैनिक जगत समीक्षा'),
  VITE_DEFAULT_LOCALE: z.enum(['hi', 'mr', 'en']).default('hi'),
  VITE_TIMEZONE: z.string().default('Asia/Kolkata'),
  VITE_DEMO_MODE: z.enum(['true', 'false']).default('false'),
  VITE_TURNSTILE_SITE_KEY: z.string().optional(),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;

let validatedEnv: ClientEnv | null = null;

/**
 * Validates client environment variables at application startup.
 * Throws a descriptive error in production if required variables are missing or malformed.
 */
export function validateClientEnv(): ClientEnv {
  if (validatedEnv) {
    return validatedEnv;
  }

  const rawEnv = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_SITE_NAME: import.meta.env.VITE_SITE_NAME,
    VITE_DEFAULT_LOCALE: import.meta.env.VITE_DEFAULT_LOCALE,
    VITE_TIMEZONE: import.meta.env.VITE_TIMEZONE,
    VITE_DEMO_MODE: import.meta.env.VITE_DEMO_MODE,
    VITE_TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
  };

  const parsed = clientEnvSchema.safeParse(rawEnv);

  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map(issue => ` - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    if (import.meta.env.PROD) {
      console.error('CRITICAL: Environment validation failed:\n' + errorDetails);
      throw new Error(`Invalid environment configuration:\n${errorDetails}`);
    } else {
      console.warn('Development environment warning:\n' + errorDetails);
      // Return safe defaults for dev/test mode
      return {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
        VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key',
        VITE_SITE_NAME: import.meta.env.VITE_SITE_NAME || 'दैनिक जगत समीक्षा',
        VITE_DEFAULT_LOCALE: (import.meta.env.VITE_DEFAULT_LOCALE as 'hi' | 'mr' | 'en') || 'hi',
        VITE_TIMEZONE: import.meta.env.VITE_TIMEZONE || 'Asia/Kolkata',
        VITE_DEMO_MODE: import.meta.env.VITE_DEMO_MODE === 'true' ? 'true' : 'false',
        VITE_TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
      };
    }
  }

  validatedEnv = parsed.data;
  return validatedEnv;
}
