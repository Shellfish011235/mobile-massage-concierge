import Link from "next/link";

const vendors = [
  {
    name: "Noterro",
    url: "https://www.noterro.com/",
    detail: "Independent clinical scheduling, intake and charting provider",
  },
  {
    name: "Jane",
    url: "https://jane.app/",
    detail: "Independent clinic management, intake and charting provider",
  },
  {
    name: "MassageBook",
    url: "https://pro.massagebook.com/",
    detail: "Independent massage practice software including intake and notes",
  },
] as const;

/**
 * Public informational provider directory only.
 * Never build booking-specific URLs, load an iframe, or transfer client data.
 * Clinical integrations are NOT connected.
 */
export default function ClinicalToolsPage() {
  return (
    <main className="space-y-6 px-gutter-x pb-6 pt-[max(3rem,env(safe-area-inset-top,0px))]">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-wide text-muted-foreground">Optional professional tools</p>
        <h1 className="font-serif text-2xl font-normal">Intake & SOAP providers</h1>
        <p className="text-sm text-muted-foreground">
          Massage Concierge does not collect or store clinical intake forms,
          SOAP notes or medical records. A therapist can use a separate
          professional provider under their own account.
        </p>
      </header>
      <section className="space-y-3" aria-label="External clinical providers">
        {vendors.map(vendor => (
          <div key={vendor.name} className="space-y-2 rounded-lg border border-border bg-card p-4">
            <h2 className="font-medium">{vendor.name}</h2>
            <p className="text-sm text-muted-foreground">{vendor.detail}</p>
            <a href={vendor.url} rel="noopener noreferrer" target="_blank"
              className="inline-block text-sm font-medium text-primary underline">
              Open provider website (external)
            </a>
          </div>
        ))}
      </section>
      <p className="rounded-lg border bg-muted p-4 text-xs text-muted-foreground">
        Informational links only. These providers are not connected, endorsed,
        or security-audited by Massage Concierge. Confirm availability,
        contracting, record retention, applicable HIPAA obligations and
        business associate agreements where required. Never paste patient
        records, clinic passwords or client-specific clinical links into
        Massage Concierge.
      </p>
      <Link href="/therapist" className="text-sm font-medium text-primary underline">
        Back to therapist home
      </Link>
    </main>
  );
}
