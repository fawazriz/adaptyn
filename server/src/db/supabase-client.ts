import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl: string | null = process.env.NEXT_PUBLIC_SUPABASE_URL ?? null;
const supabaseKey: string | null = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? null;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;