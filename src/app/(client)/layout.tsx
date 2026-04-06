import Link from "next/link";

import { signOutAction } from "@/actions/auth-actions";
import { ClientBottomNav } from "@/components/client/client-bottom-nav";
import { Button } from "@/components/ui/button";
import { tryCreateSupabaseServerClient } from "@/lib/supabase/server-client";

export const dynamic = "force-dynamic";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await tryCreateSupabaseServerClient();
  let email: string | null = null;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    email = user?.email ?? null;
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-3 px-gutter-x md:h-16">
          <Link
            href="/discover"
            className="font-serif text-lg font-medium tracking-tight text-foreground md:text-xl"
          >
            Palm Concierge
          </Link>
          <div className="flex shrink-0 items-center gap-2 md:gap-3">
            {email ? (
              <>
                <span className="hidden max-w-[140px] truncate text-pom-xs text-muted-foreground sm:inline">
                  {email}
                </span>
                <form action={signOutAction}>
                  <Button type="submit" variant="ghost" size="sm" className="text-pom-xs uppercase tracking-wide">
                    Sign out
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-pom-xs uppercase tracking-wide">
                  Sign in
                </Button>
              </Link>
            )}
            <Link
              href="/"
              className="text-pom-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              Site
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-2xl px-gutter-x pb-24 pt-6 md:pb-10">{children}</div>
      <ClientBottomNav />
    </div>
  );
}
