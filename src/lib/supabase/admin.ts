import 'server-only';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE;

// 필수: URL은 있어야 함
if (!url) throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
// 둘 중 하나는 있어야 함(서비스키 or 아논키)
if (!serviceRole && !anon) throw new Error('Missing Supabase key: set SUPABASE_SERVICE_ROLE or NEXT_PUBLIC_SUPABASE_ANON_KEY');

export const supabaseAdmin: SupabaseClient = createClient(url, (serviceRole ?? anon)!, {
  auth: { autoRefreshToken: false, persistSession: false },
});
