import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getTherapistById } from "@/data/mock-therapists";
import { formatUsd } from "@/lib/format/currency";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const t = getTherapistById(id);
  return {
    title: t ? `${t.displayName} | Palm Concierge` : "Therapist | Palm Concierge",
  };
}

export default async function TherapistProfilePage({ params }: Props) {
  const { id } = await params;
  const t = getTherapistById(id);
  if (!t) notFound();

  const primary = t.services[0];

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-pom-2xl border border-border bg-card shadow-pom-2">
        <div className="aspect-[16/9] bg-muted md:aspect-[21/9]">
          <div className="flex h-full items-center justify-center font-serif text-5xl font-light text-muted-foreground">
            {t.displayName.slice(0, 1)}
          </div>
        </div>
        <div className="space-y-4 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl font-light tracking-tight">{t.displayName}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {t.licenseVerified ? (
                  <Badge variant="verified" className="normal-case tracking-normal">
                    Licensed
                  </Badge>
                ) : null}
                {t.insuranceVerified ? (
                  <Badge variant="outline" className="normal-case tracking-normal">
                    Insured
                  </Badge>
                ) : null}
              </div>
            </div>
            <div className="text-right">
              <p className="inline-flex items-center gap-1.5 text-pom-sm text-muted-foreground">
                <Star className="size-4 fill-pom-gold text-pom-gold" aria-hidden />
                <span className="font-semibold text-foreground">{t.ratingAverage.toFixed(2)}</span>
                <span>({t.ratingCount} reviews)</span>
              </p>
              {t.city && t.state ? (
                <p className="mt-1 inline-flex items-center justify-end gap-1 text-pom-sm text-muted-foreground">
                  <MapPin className="size-3.5" aria-hidden />
                  {t.city}, {t.state} · {t.travelRadiusMiles} mi radius
                </p>
              ) : null}
            </div>
          </div>
          {t.bio ? <p className="text-pom-base leading-relaxed text-muted-foreground">{t.bio}</p> : null}
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-pom-pill">
              <Link href={`/book/${t.id}`}>Request booking</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-pom-pill">
              <Link href="/discover">Back</Link>
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Specialties</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {t.specialties.map((s) => (
            <Badge key={s} variant="secondary" className="normal-case tracking-normal">
              {s}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services & pricing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {t.services.map((svc) => (
            <div key={svc.id}>
              <h3 className="font-medium text-foreground">{svc.name}</h3>
              {svc.description ? (
                <p className="mt-1 text-pom-sm text-muted-foreground">{svc.description}</p>
              ) : null}
              <p className="mt-2 text-pom-sm text-muted-foreground">
                Durations: {svc.durationOptions.join(", ")} minutes
              </p>
              <Separator className="my-4" />
            </div>
          ))}
          <p className="text-pom-xs text-muted-foreground">
            Prices shown as estimates for the primary service. Final total confirmed before payment.
            {primary
              ? ` Starting near ${formatUsd(Math.min(...Object.values(primary.durationPriceMap).filter(Boolean)))}.`
              : ""}
          </p>
        </CardContent>
      </Card>

      {t.certifications.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc text-pom-sm text-muted-foreground">
              {t.certifications.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
