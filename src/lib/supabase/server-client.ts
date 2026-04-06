import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import { getSupabasePublicEnv } from "@/lib/supabase/env";

/** Server client when env is configured; otherwise null (build / local without Supabase). */
export async function tryCreateSupabaseServerClient(): Promise<SupabaseClient | null> {
  const { url, anonKey } = getSupabasePublicEnv();
  if (!url || !anonKey) return null;

  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          /* Server Component — cookies may be read-only */
        }
      },
    },
  });
}
