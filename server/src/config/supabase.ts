import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export const isSupabaseConfigured = Boolean(
  env.SUPABASE_URL &&
  env.SUPABASE_SERVICE_ROLE_KEY &&
  !env.SUPABASE_URL.includes('placeholder')
);

export const supabaseAdmin = isSupabaseConfigured
  ? createClient(
      env.SUPABASE_URL!,
      env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;
