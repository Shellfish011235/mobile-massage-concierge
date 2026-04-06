import Link from "next/link";
import { ChevronRight, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatUsd } from "@/lib/format/currency";
import type { TherapistProfileSummary } from "@/types/therapist-profile";

function availabilityLabel(s: TherapistProfileSummary["availabilityStatus"]): string {
  if (s === "on_duty") return "Available";
  if (s === "busy") return "Limited";
  if (s === "off_duty") return "Away";
  return "";
}

export function TherapistDiscoveryCard({ therapist }: { therapist: TherapistProfileSummary }) {
  const price = therapist.priceStartingAt;

  return (
    <Card className="overflow-hidden border-border/80 shadow-pom-2 transition-shadow duration-pom hover:shadow-pom-3">
      <CardContent className="p-0">
        <div className="flex gap-4 p-5">
          <div
            className="relative size-24 shrink-0 overflow-hidden rounded-pom-xl bg-muted"
            aria-hidden
          >
            <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl font-light text-muted-foreground">
              {therapist.displayName.slice(0, 1)}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-serif text-xl font-medium tracking-tight">{therapist.displayName}</h2>
              {therapist.licenseVerified ? (
                <Badge variant="verified" className="normal-case tracking-normal">
                  Licensed
                </Badge>
              ) : null}
              {therapist.insuranceVerified ? (
                <Badge variant="outline" className="normal-case tracking-normal">
                  Insured
                </Badge>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-pom-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Star className="size-3.5 fill-pom-gold text-pom-gold" aria-hidden />
                <span className="font-medium text-foreground">{therapist.ratingAverage.toFixed(2)}</span>
                <span>({therapist.ratingCount})</span>
              </span>
              {therapist.distanceMiles != null ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3.5" aria-hidden />
                  {therapist.distanceMiles.toFixed(1)} mi
                </span>
              ) : null}
              <span className="text-foreground/80">{availabilityLabel(therapist.availabilityStatus)}</span>
            </div>
            <p className="mt-3 line-clamp-2 text-pom-sm leading-relaxed text-muted-foreground">
              {therapist.specialties.join(" · ")}
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                {price != null ? (
                  <p className="text-pom-xs uppercase tracking-wide text-muted-foreground">From</p>
                ) : null}
                <p className="font-medium tabular-nums text-foreground">
                  {price != null ? formatUsd(price) : "Request quote"}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/therapists/${therapist.id}`}
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-pom-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  Profile
                </Link>
                <Link
                  href={`/book/${therapist.id}`}
                  className="inline-flex h-10 items-center justify-center gap-1 rounded-md bg-primary px-4 text-pom-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
                >
                  Book
                  <ChevronRight className="size-4 opacity-80" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
