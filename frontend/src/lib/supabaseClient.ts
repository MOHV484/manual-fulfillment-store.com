import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('خطأ في النظام: متغيرات البيئة الخاصة بـ Supabase غير مكتملة.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
