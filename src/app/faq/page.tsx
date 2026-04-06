import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "FAQ | Palm Concierge",
};

const items = [
  {
    q: "Does Palm Concierge provide massage services?",
    a: "No. Palm Concierge is a marketplace that connects you with independent licensed professionals. Your therapist is responsible for their practice and conduct.",
  },
  {
    q: "How are therapists verified?",
    a: "We review license and insurance documentation before a profile can receive bookings. You will see licensed and insured indicators on approved profiles.",
  },
  {
    q: "Can I book for a hotel?",
    a: "Yes. Select hotel as the location type, add the property name, and note valet or access details so your therapist can plan arrival smoothly.",
  },
];

export default function FaqPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <h1 className="font-serif text-4xl font-light text-onyx">Frequently asked</h1>
        <dl className="mt-12 space-y-10">
          {items.map((item) => (
            <div key={item.q}>
              <dt className="font-medium text-onyx">{item.q}</dt>
              <dd className="mt-3 text-sm font-light leading-relaxed text-onyx/75">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </MarketingShell>
  );
}
