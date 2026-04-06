import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "Trust & verification | Palm Concierge",
};

export default function TrustPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-muted">Safety</p>
        <h1 className="mt-4 font-serif text-4xl font-light text-onyx">Trust, first</h1>
        <div className="mt-10 space-y-6 text-lg font-light leading-relaxed text-onyx/80">
          <p>
            Every therapist on Palm Concierge carries active professional licensing and liability insurance. We
            review credentials before anyone appears in client discovery.
          </p>
          <p>
            Ratings flow both ways after completed sessions—so professionals and guests are held to the same
            standard of respect and preparedness.
          </p>
          <p>
            Payments and payouts are designed around transparent line items: session, travel, optional hotel
            coordination, and a clear platform fee—so you always know what you are paying for.
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
