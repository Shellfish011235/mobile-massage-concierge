import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getSupabasePublicEnv } from "@/lib/supabase/env";

/**
 * Refreshes auth session in middleware. Mutates response cookies.
 * Returns null if Supabase env is not set (no-op).
 */
export function createSupabaseMiddlewareClient(request: NextRequest) {
  const { url, anonKey } = getSupabasePublicEnv();
  if (!url || !anonKey) {
    return { supabase: null as ReturnType<typeof createServerClient> | null, response: null as NextResponse | null };
  }

  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  return { supabase, response };
}
