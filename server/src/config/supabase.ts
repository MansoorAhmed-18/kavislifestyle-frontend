import { createClient } from '@supabase/supabase-js';
import { env } from './env';

const hasValidServiceKey = Boolean(
  env.SUPABASE_SERVICE_ROLE_KEY &&
  env.SUPABASE_SERVICE_ROLE_KEY !== 'placeholder-service-key' &&
  !env.SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')
);

const hasValidAnonKey = Boolean(
  env.SUPABASE_ANON_KEY &&
  env.SUPABASE_ANON_KEY !== 'placeholder-anon-key' &&
  !env.SUPABASE_ANON_KEY.includes('placeholder')
);

const activeKey = hasValidServiceKey
  ? env.SUPABASE_SERVICE_ROLE_KEY
  : hasValidAnonKey
  ? env.SUPABASE_ANON_KEY
  : null;

export const isSupabaseConfigured = Boolean(
  env.SUPABASE_URL &&
  !env.SUPABASE_URL.includes('placeholder') &&
  activeKey
);

export const supabaseAdmin: any = isSupabaseConfigured && activeKey
  ? createClient<any>(
      env.SUPABASE_URL!,
      activeKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  : null;
