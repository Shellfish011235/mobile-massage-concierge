import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "Privacy | Palm Concierge",
};

export default function PrivacyPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <h1 className="font-serif text-3xl font-light text-onyx">Privacy policy</h1>
        <p className="mt-8 text-sm font-light leading-relaxed text-onyx/70">
          Placeholder: this policy will cover data we collect for bookings, verification documents, messaging,
          analytics, retention, and your choices. Draft with counsel before production launch.
        </p>
      </div>
    </MarketingShell>
  );
}
