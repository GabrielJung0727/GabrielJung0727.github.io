import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// ✅ .env.local 직접 로드
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole =
  process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY; // ✅ 둘 다 허용

if (!url) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL');
  console.error(
    '현재 process.env keys:',
    Object.keys(process.env).filter((k) => k.includes('SUPABASE'))
  );
  throw new Error('Supabase URL이 누락되었습니다.');
}
if (!serviceRole) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE');
  console.error(
    '현재 process.env keys:',
    Object.keys(process.env).filter((k) => k.includes('SUPABASE'))
  );
  throw new Error('Service Role Key 누락됨 (.env.local 확인)');
}

export const supabaseAdmin = createClient(url, serviceRole, {
  auth: { autoRefreshToken: false, persistSession: false },
});
