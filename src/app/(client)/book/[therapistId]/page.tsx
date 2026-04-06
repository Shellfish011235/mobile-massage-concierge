import Link from "next/link";
import { notFound } from "next/navigation";

import { BookingWizard } from "@/components/client/booking-wizard";
import { getTherapistById } from "@/data/mock-therapists";

type Props = { params: Promise<{ therapistId: string }> };

export async function generateMetadata({ params }: Props) {
  const { therapistId } = await params;
  const t = getTherapistById(therapistId);
  return { title: t ? `Book ${t.displayName} | Palm Concierge` : "Book | Palm Concierge" };
}

export default async function BookPage({ params }: Props) {
  const { therapistId } = await params;
  const therapist = getTherapistById(therapistId);
  if (!therapist) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href={`/therapists/${therapist.id}`} className="text-pom-sm text-muted-foreground hover:text-foreground">
          Back to profile
        </Link>
        <h1 className="pom-display mt-4 text-pom-2xl text-foreground">
          Request a session with {therapist.displayName}
        </h1>
        <p className="mt-2 text-pom-sm text-muted-foreground">
          Demo: requests save to session storage in this browser only.
        </p>
      </div>
      <BookingWizard therapist={therapist} />
    </div>
  );
}
