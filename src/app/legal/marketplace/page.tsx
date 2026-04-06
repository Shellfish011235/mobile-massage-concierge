import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "Marketplace disclosure | Palm Concierge",
};

export default function MarketplacePage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <h1 className="font-serif text-3xl font-light text-onyx">Marketplace disclosure</h1>
        <div className="mt-8 space-y-4 text-sm font-light leading-relaxed text-onyx/75">
          <p>
            Palm Concierge operates a technology platform that connects clients with independent massage therapy
            providers. Palm Concierge does not employ therapists on the platform and does not itself provide
            massage therapy services.
          </p>
          <p>
            Providers are responsible for maintaining valid licenses and insurance, for the quality and safety of
            their services, and for compliance with applicable laws and regulations.
          </p>
        </div>
      </div>
    </MarketingShell>
  );
}
