import { createClient } from '@supabase/supabase-js';

// Production Supabase project credentials provided for Kavi's Lifestyle
const DEFAULT_SUPABASE_URL = 'https://yxvsfaqqkfbfcjuymebo.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_xpkTcSPSAkjSfO8-3svKyw_O5tZ2M_O';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  supabaseAnonKey !== 'placeholder-anon-key'
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
