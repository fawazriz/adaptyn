import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl: string | null = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
const supabaseKey: string | null = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? null;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}
const config = { url: supabaseUrl, key: supabaseKey };

export function createSupabaseClient(token?: string) {
  return createClient(config.url, config.key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    ...(token ? { accessToken: async () => token } : {}),
  });
}
