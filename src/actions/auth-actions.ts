"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { tryCreateSupabaseServerClient } from "@/lib/supabase/server-client";

export async function signOutAction() {
  const supabase = await tryCreateSupabaseServerClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  revalidatePath("/", "layout");
  redirect("/login");
}
