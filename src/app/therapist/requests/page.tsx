import Link from "next/link";

export default function TherapistRequestsPage() {
  return (
    <main className="px-gutter-x pb-6 pt-[max(3rem,env(safe-area-inset-top,0px))]">
      <h1 className="font-serif text-2xl font-normal text-foreground">Requests</h1>
      <p className="mt-2 text-pom-sm text-muted-foreground">
        The general marketplace request queue is still being developed.
      </p>
      <section className="mt-6 rounded-pom-lg border border-border p-4">
        <h2 className="font-serif text-xl">Addison Massage Concierge</h2>
        <p className="mt-2 text-pom-sm text-muted-foreground">
          Preview Addison room approvals, in-apartment pricing, and payment choices.
          This is a simulation only; real messages and payments remain disabled.
        </p>
        <Link href="/addison" className="mt-4 inline-block text-pom-sm font-medium text-primary underline">
          Open Addison preview
        </Link>
      </section>
      <Link href="/therapist" className="mt-8 inline-block text-pom-sm font-medium text-primary underline">
        Back to home
      </Link>
    </main>
  );
}
