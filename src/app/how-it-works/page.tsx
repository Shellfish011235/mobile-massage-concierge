import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "How it works | Palm Concierge",
};

export default function HowItWorksPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold-muted">Process</p>
        <h1 className="mt-4 font-serif text-4xl font-light text-onyx">How Palm Concierge works</h1>
        <ol className="mt-10 space-y-8 text-lg font-light leading-relaxed text-onyx/80">
          <li>
            <span className="font-medium text-onyx">1.</span> Browse independent therapists who are licensed,
            insured, and approved by our team.
          </li>
          <li>
            <span className="font-medium text-onyx">2.</span> Request a session with your location, timing, and
            environment details.
          </li>
          <li>
            <span className="font-medium text-onyx">3.</span> Your professional confirms, prepares, and arrives
            with everything needed for a calm in-home or hotel treatment.
          </li>
        </ol>
        <p className="mt-12 text-sm font-light leading-relaxed text-mist">
          Palm Concierge is a technology platform. Therapists are independent professionals, not employees of
          Palm Concierge.
        </p>
      </div>
    </MarketingShell>
  );
}
