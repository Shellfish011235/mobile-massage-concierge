import Link from "next/link";

import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "Apply as a therapist | Palm Concierge",
};

export default function TherapistApplyPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-muted">
          Professionals
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light text-onyx">Join as an independent therapist</h1>
        <p className="mt-6 text-lg font-light leading-relaxed text-onyx/80">
          We are onboarding licensed, insured massage therapists who value discretion, punctuality, and elevated
          in-home service. Upload credentials, set your radius, and accept requests that fit your schedule.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/therapist"
            className="inline-flex min-h-[3rem] items-center justify-center bg-onyx px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne transition-colors hover:bg-onyx-800"
          >
            Open therapist preview
          </Link>
          <Link
            href="/discover"
            className="inline-flex min-h-[3rem] items-center justify-center border border-onyx/20 px-8 text-[11px] font-semibold uppercase tracking-[0.2em] text-onyx/80 hover:border-onyx/40"
          >
            View client experience
          </Link>
        </div>
      </div>
    </MarketingShell>
  );
}
