import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "Terms | Palm Concierge",
};

export default function TermsPage() {
  return (
    <MarketingShell>
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <h1 className="font-serif text-3xl font-light text-onyx">Terms of use</h1>
        <p className="mt-8 text-sm font-light leading-relaxed text-onyx/70">
          Placeholder: final terms will describe platform rules, eligibility, payments, cancellations, and
          limitation of liability. Palm Concierge facilitates introductions and booking technology; massage therapy
          is performed solely by independent licensed professionals.
        </p>
      </div>
    </MarketingShell>
  );
}
