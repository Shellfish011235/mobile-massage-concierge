import Link from "next/link";

import { LoginForm } from "@/components/auth/login-form";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export const metadata = { title: "Sign in | Palm Concierge" };

export default function LoginPage() {
  const configured = Boolean(getSupabasePublicEnv().url);

  return (
    <div className="flex min-h-dvh flex-col bg-background px-gutter-x py-16 text-foreground">
      <Link href="/" className="font-serif text-xl font-medium">
        Palm Concierge
      </Link>
      <div className="mx-auto mt-16 w-full max-w-sm space-y-8">
        <div>
          <h1 className="font-serif text-3xl font-light">Sign in</h1>
          <p className="mt-2 text-pom-sm text-muted-foreground">
            Access saved bookings and live requests when Supabase is configured.
          </p>
        </div>
        {!configured ? (
          <p className="rounded-pom-lg border border-border bg-muted/40 p-4 text-pom-sm text-muted-foreground">
            Add <code className="text-pom-xs">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
            <code className="text-pom-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to{" "}
            <code className="text-pom-xs">.env.local</code>. Until then, use the demo booking flow (session
            storage).
          </p>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
}
