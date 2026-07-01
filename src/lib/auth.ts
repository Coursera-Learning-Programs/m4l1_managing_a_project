import { supabase } from '@/lib/supabase';

/**
 * This is a single-user personal app with no sign-in UI. On boot we reuse an
 * existing session if there is one, otherwise sign in with the one account's
 * credentials from env vars. The Supabase user itself must already exist
 * (created once via the Supabase Dashboard) -- the app never has the
 * service-role rights needed to create users.
 */
export async function ensureSignedIn() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) return session;

  const email = process.env.EXPO_PUBLIC_AUTH_EMAIL;
  const password = process.env.EXPO_PUBLIC_AUTH_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Missing EXPO_PUBLIC_AUTH_EMAIL / EXPO_PUBLIC_AUTH_PASSWORD. Set them in your .env file.'
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.session;
}
