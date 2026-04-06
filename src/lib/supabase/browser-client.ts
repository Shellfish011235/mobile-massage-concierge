"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabasePublicEnv } from "@/lib/supabase/env";

/** Browser client when env is configured. */
export function tryCreateSupabaseBrowserClient(): SupabaseClient | null {
  const { url, anonKey } = getSupabasePublicEnv();
  if (!url || !anonKey) return null;
  return createBrowserClient(url, anonKey);
}
