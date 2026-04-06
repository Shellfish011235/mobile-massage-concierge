import { FadeIn } from "@/components/marketing/fade-in";
import { Leaf, Moon, Shield } from "lucide-react";
import Link from "next/link";

const pillars = [
  {
    title: "Curated arrival",
    body: "Request a session with clarity—location, timing, and environment notes tailored to how you live or travel.",
    icon: Moon,
  },
  {
    title: "Licensed on the platform",
    body: "Professionals on POM carry the credentials and coverage appropriate to their practice. Verification is part of our trust layer.",
    icon: Shield,
  },
  {
    title: "Quiet luxury",
    body: "No noise. No rush. A calm interface and session flow designed to feel as composed as a private spa suite.",
    icon: Leaf,
  },
] as const;

export function LuxuryExperience() {
  return (
    <section
      id="experience"
      className="grain border-b border-onyx/[0.06] bg-champagne px-6 py-24 md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <FadeIn>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-muted">
            The experience
          </p>
          <h2 className="mt-5 max-w-2xl font-serif text-4xl font-light leading-tight tracking-[-0.02em] text-onyx md:text-5xl">
            Composed like a suite at dusk—soft light, soft sound, soft pace.
          </h2>
        </FadeIn>
        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          <FadeIn delay={0.08}>
            <p className="text-lg font-light leading-[1.75] text-onyx/75">
              POM exists for guests who treat rest as a discipline. We connect you
              with independent massage professionals whose standards match yours—so
              the first exhale feels like the beginning of the stay, not the end of
              the day.
            </p>
          </FadeIn>
          <FadeIn delay={0.12}>
            <p className="text-lg font-light leading-[1.75] text-onyx/75">
              From residences to hotels and private events, every booking is
              structured around discretion, preparedness, and transparent
              pricing—before you confirm.
            </p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

export function LuxuryPillars() {
  return (
    <section className="bg-champagne-50 px-6 py-24 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10">
          {pillars.map(({ title, body, icon: Icon }, i) => (
            <FadeIn key={title} delay={i * 0.06}>
              <div className="border-t border-gold/30 pt-8">
                <Icon
                  className="size-7 text-gold-muted"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <h3 className="mt-6 font-serif text-2xl font-medium text-onyx">
                  {title}
                </h3>
                <p className="mt-4 text-[15px] font-light leading-relaxed text-mist">
                  {body}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LuxuryDarkBand() {
  return (
    <section
      id="trust"
      className="relative overflow-hidden bg-onyx px-6 py-28 text-champagne md:px-10 md:py-36"
    >
      <div
        className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl">
        <FadeIn>
          <div className="h-px w-16 bg-gold/50" />
          <h2 className="mt-10 max-w-3xl font-serif text-[clamp(2rem,4vw,3rem)] font-light leading-[1.15] tracking-[-0.02em]">
            A marketplace built for confidence—not volume.
          </h2>
          <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-champagne/75">
            POM is a technology platform. We do not provide massage therapy. We
            connect you with independent professionals who set their own standards
            of practice, carry their own licensing and insurance, and deliver
            services on their own behalf.
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

export function LuxuryQuote() {
  return (
    <section className="border-b border-onyx/[0.06] bg-champagne px-6 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <FadeIn>
          <blockquote className="font-serif text-3xl font-light italic leading-snug text-onyx md:text-[2.15rem] md:leading-tight">
            “The rare kind of ease that doesn’t announce itself—it simply
            arrives.”
          </blockquote>
          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.28em] text-mist">
            For guests who prefer understatement
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

export function LuxuryReserve() {
  return (
    <section
      id="reserve"
      className="grain bg-champagne-50 px-6 py-28 md:px-10 md:py-36"
    >
      <div className="mx-auto max-w-3xl text-center">
        <FadeIn>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-muted">
            Reserve
          </p>
          <h2 className="mt-6 font-serif text-4xl font-light text-onyx md:text-5xl">
            Your next quiet hour.
          </h2>
          <p className="mt-6 text-lg font-light text-onyx/65">
            Discovery, booking, and session updates—designed to feel calm at every
            step. Therapist tools and client experiences continue to ship here.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/discover"
              className="touch-manipulation inline-flex min-h-[3.25rem] min-w-[220px] items-center justify-center bg-onyx px-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-champagne transition-colors duration-300 hover:bg-onyx-800 active:scale-[0.98]"
            >
              Book a session
            </Link>
            <Link
              href="/therapist"
              scroll={false}
              className="touch-manipulation inline-flex min-h-[3.25rem] min-w-[220px] items-center justify-center border border-onyx/15 px-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-onyx/80 transition-colors duration-300 hover:border-onyx/30"
            >
              Professional home
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

export function LuxuryFooter() {
  return (
    <footer className="border-t border-onyx/[0.08] bg-onyx px-6 py-16 text-champagne/55 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-10 md:flex-row md:items-end">
        <div>
          <p className="font-serif text-2xl text-champagne">Palm Concierge</p>
          <p className="mt-4 max-w-md text-sm font-light leading-relaxed">
            Palm Concierge is a technology platform connecting clients with independent
            licensed and insured professionals. Therapists on the platform are
            independent contractors responsible for their services and conduct.
          </p>
          <nav
            className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne/45"
            aria-label="Legal"
          >
            <Link href="/how-it-works" className="transition-colors hover:text-champagne/80">
              How it works
            </Link>
            <Link href="/trust" className="transition-colors hover:text-champagne/80">
              Trust
            </Link>
            <Link href="/faq" className="transition-colors hover:text-champagne/80">
              FAQ
            </Link>
            <Link href="/therapists/apply" className="transition-colors hover:text-champagne/80">
              Apply
            </Link>
            <Link href="/legal/terms" className="transition-colors hover:text-champagne/80">
              Terms
            </Link>
            <Link href="/legal/privacy" className="transition-colors hover:text-champagne/80">
              Privacy
            </Link>
            <Link href="/legal/marketplace" className="transition-colors hover:text-champagne/80">
              Marketplace
            </Link>
          </nav>
        </div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-champagne/40">
          © {new Date().getFullYear()} Palm Concierge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
