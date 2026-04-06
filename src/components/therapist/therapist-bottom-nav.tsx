"use client";

import { motion } from "framer-motion";
import { CalendarDays, ClipboardCheck, Home, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/therapist", label: "Home", Icon: Home },
  { href: "/therapist/requests", label: "Requests", Icon: ClipboardCheck },
  { href: "/therapist/calendar", label: "Calendar", Icon: CalendarDays },
  { href: "/therapist/inbox", label: "Inbox", Icon: Mail },
] as const;

export function TherapistBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center"
      aria-label="Therapist navigation"
    >
      <div className="pointer-events-auto w-full max-w-md border-t border-border/80 bg-background/95 px-2 pt-2 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-pom-2">
        <div className="flex items-stretch justify-around">
          {items.map(({ href, label, Icon }) => {
            const active =
              href === "/therapist"
                ? pathname === "/therapist"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                scroll={false}
                className={`touch-manipulation flex min-w-[4.5rem] flex-col items-center gap-1 rounded-pom-lg px-3 py-2 text-pom-xs font-medium text-foreground no-underline transition-colors duration-pom ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <motion.span
                  className="inline-flex"
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 500, damping: 28 }}
                >
                  <Icon
                    className="size-6"
                    strokeWidth={active ? 2.25 : 1.75}
                    aria-hidden
                  />
                </motion.span>
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
