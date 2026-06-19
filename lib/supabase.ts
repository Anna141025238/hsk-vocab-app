import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_anon_key';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key';

const isConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

if (!isConfigured) {
  console.warn('⚠️ Supabase credentials not configured. Auth will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export { isConfigured as supabaseConfigured };

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { data, error };
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { data, error };
}
