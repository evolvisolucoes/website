import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'SUA_URL_SUPABASE';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'SUA_CHAVE_ANON_SUPABASE';

export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);