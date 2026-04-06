import type { ReactNode } from "react";

import { LuxuryFooter } from "@/components/marketing/luxury-sections";
import { LuxuryNav } from "@/components/marketing/luxury-nav";

export function MarketingShell({
  children,
  mainClassName = "",
}: {
  children: ReactNode;
  mainClassName?: string;
}) {
  return (
    <>
      <LuxuryNav />
      <main className={`min-h-[50vh] pt-20 md:pt-[4.5rem] ${mainClassName}`}>{children}</main>
      <LuxuryFooter />
    </>
  );
}
