"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Heart, Search } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/discover", label: "Discover", icon: Search },
  { href: "/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/favorites", label: "Saved", icon: Heart },
] as const;

export function ClientBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="pointer-events-auto fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md shadow-pom-2 md:hidden"
      aria-label="Client"
    >
      <div className="mx-auto flex max-w-md justify-around px-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-w-[4.5rem] flex-col items-center gap-1 rounded-pom-lg px-3 py-2 text-[11px] font-medium transition-colors duration-pom",
                active ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-5" aria-hidden />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
