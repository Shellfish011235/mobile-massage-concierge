import { DashboardSummary } from "@/components/therapist/dashboard-summary";
import { DutyToggle } from "@/components/therapist/duty-toggle";
import {
  JobRequestCard,
  type JobRequestPreview,
} from "@/components/therapist/job-request-card";
import { ProfileQuickGrid } from "@/components/therapist/profile-quick-grid";
import { ServiceAreaMap } from "@/components/therapist/service-area-map";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck } from "lucide-react";
import Link from "next/link";

const MOCK_JOBS: JobRequestPreview[] = [
  {
    id: "1",
    title: "Deep Tissue Massage",
    distanceMiles: 4.5,
    locationLine: "Hotel (valet coordination)",
    priceLabel: "$120 · 60 min",
    avatarFallback: "M",
    avatarClassName: "bg-pom-seaglass-subtle text-pom-seaglass",
  },
  {
    id: "2",
    title: "Swedish Massage",
    distanceMiles: 2.1,
    locationLine: "Residence",
    priceLabel: "$95 · 90 min",
    avatarFallback: "J",
    avatarClassName: "bg-pom-palm-subtle text-pom-palm",
  },
  {
    id: "3",
    title: "Sports Massage",
    distanceMiles: 6.0,
    locationLine: "Office",
    priceLabel: "$110 · 60 min",
    avatarFallback: "K",
    avatarClassName: "bg-pom-champagne text-pom-ink-secondary",
  },
];

export default function TherapistHomePage() {
  return (
    <main className="px-gutter-x pb-2 pt-[max(3.25rem,env(safe-area-inset-top,0px))]">
      <header className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className="flex size-[3.75rem] shrink-0 items-center justify-center rounded-pom-2xl bg-gradient-to-br from-pom-palm-subtle via-pom-sage-subtle to-pom-seaglass-subtle font-serif text-xl font-medium text-pom-ink shadow-pom-1 ring-1 ring-border/40"
            aria-hidden
          >
            S
          </div>
          <div className="min-w-0 space-y-1">
            <p className="pom-overline text-muted-foreground">Professional</p>
            <h1 className="font-serif text-2xl font-normal tracking-tight text-foreground md:text-[1.65rem]">
              Welcome, Sarah
            </h1>
            <p className="text-pom-sm text-muted-foreground">Licensed on Palm Concierge</p>
          </div>
        </div>
        <Badge variant="verified" className="mt-1 shrink-0 gap-1 normal-case tracking-normal">
          <ShieldCheck className="size-3.5" aria-hidden />
          Verified
        </Badge>
      </header>

      <div className="mt-8">
        <DutyToggle />
      </div>

      <div className="mt-8">
        <DashboardSummary />
      </div>

      <section className="mt-12 space-y-4">
        <div>
          <p className="pom-overline text-muted-foreground">Queue</p>
          <h2 className="mt-1 font-serif text-xl font-normal text-foreground">Available requests</h2>
        </div>
        <ul className="flex flex-col gap-3" role="list">
          {MOCK_JOBS.map((job) => (
            <li key={job.id} role="listitem">
              <JobRequestCard {...job} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 space-y-4">
        <div>
          <p className="pom-overline text-muted-foreground">Coverage</p>
          <h2 className="mt-1 font-serif text-xl font-normal text-foreground">Your service area</h2>
        </div>
        <ServiceAreaMap />
      </section>

      <section className="mt-10 grid grid-cols-1 gap-3">
        <Link href="/demo/business" className="rounded-pom-xl border border-border bg-card p-4 text-sm font-medium text-primary underline">Shellfish Business POC · Interactive demo</Link>
        <Link href="/therapist/calendar" className="rounded-pom-xl border border-border bg-card p-4 text-sm font-medium text-primary underline">
          Calendar &amp; travel buffers
        </Link>
        <Link href="/therapist/clinical-tools" className="rounded-pom-xl border border-border bg-card p-4 text-sm font-medium text-primary underline">
          Intake &amp; SOAP provider options (external)
        </Link>
      </section>

      <section className="mt-12 space-y-4">
        <div>
          <p className="pom-overline text-muted-foreground">Account</p>
          <h2 className="mt-1 font-serif text-xl font-normal text-foreground">Profile & tools</h2>
        </div>
        <ProfileQuickGrid />
      </section>

      <Separator className="my-10 bg-border/80" />

      <p className="pb-6 text-center text-pom-xs leading-relaxed text-muted-foreground">
        Palm Concierge is a technology platform connecting clients with independent licensed
        professionals.{" "}
        <Link
          href="/discover"
          className="font-medium text-primary underline decoration-primary/25 underline-offset-4 transition-colors hover:text-foreground"
        >
          Client experience
        </Link>
      </p>
    </main>
  );
}
