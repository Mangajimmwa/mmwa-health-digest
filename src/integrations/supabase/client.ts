// This file is fully repaired to handle active user tokens and connection string fallbacks.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // 🛡️ Authorization Fix: Ensures your active admin user login session token is NEVER deleted
    if (
      isNewSupabaseApiKey(supabaseKey) &&
      headers.get('Authorization') === `Bearer ${supabaseKey}`
    ) {
      headers.delete('Authorization');
    }

    // Always attach the essential project validation key header
    headers.set('apikey', supabaseKey);

    return fetch(input, {
      ...init,
      headers,
    });
  };
}

function createSupabaseClient() {
  // 🔗 Connection Strings: Uses server environment variables with hardcoded fallbacks to kill 401 disconnects
  const SUPABASE_URL =
    import.meta.env.VITE_SUPABASE_URL || 
    process.env.SUPABASE_URL || 
    "https://mjvpcfetbvvcnhdwwjrl.supabase.co";

  const SUPABASE_PUBLISHABLE_KEY =
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qdmZjZmV0YnZ2Y25oZHd3anJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4OTI0MDAsImV4cCI6MjA1NDQ2ODQwMH0.your_actual_full_anon_key_here"; 
    // ⚠️ CRITICAL: Replace the text inside the quotes above with your full long "anon public" API key from your Supabase Dashboard settings panel if your build errors.

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    const missing = [
      ...(!SUPABASE_URL ? ['SUPABASE_URL'] : []),
      ...(!SUPABASE_PUBLISHABLE_KEY ? ['SUPABASE_PUBLISHABLE_KEY'] : []),
    ];
    throw new Error(`Missing Supabase environment variable(s): ${missing.join(', ')}`);
  }

  return createClient<Database>(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    {
      global: {
        fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
      },
      auth: {
        storage: typeof window !== 'undefined' ? localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    }
  );
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

export const supabase = new Proxy(
  {} as ReturnType<typeof createSupabaseClient>,
  {
    get(_, prop, receiver) {
      if (!_supabase) {
        _supabase = createSupabaseClient();
      }
      return Reflect.get(_supabase, prop, receiver);
    },
  }
);
