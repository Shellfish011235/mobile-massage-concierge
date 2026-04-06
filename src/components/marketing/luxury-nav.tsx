import Link from "next/link";

export function LuxuryNav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-onyx/[0.06] bg-champagne/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-[4.5rem] md:px-10">
        <Link
          href="/"
          className="font-serif text-2xl font-medium tracking-[0.02em] text-onyx transition-opacity duration-300 hover:opacity-80 active:opacity-60 md:text-[1.65rem]"
        >
          POM
        </Link>
        <nav
          className="flex items-center gap-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-onyx/70 md:gap-8"
          aria-label="Primary"
        >
          <Link
            href="/how-it-works"
            className="touch-manipulation transition-all duration-300 ease-out hover:text-onyx hover:underline hover:underline-offset-4"
          >
            How it works
          </Link>
          <Link
            href="/trust"
            className="touch-manipulation transition-all duration-300 ease-out hover:text-onyx hover:underline hover:underline-offset-4"
          >
            Trust
          </Link>
          <Link
            href="/discover"
            className="touch-manipulation transition-all duration-300 ease-out hover:text-onyx"
          >
            Book
          </Link>
          <Link
            href="/therapist"
            scroll={false}
            className="touch-manipulation transition-all duration-300 ease-out hover:text-onyx"
          >
            Professionals
          </Link>
        </nav>
      </div>
    </header>
  );
}
