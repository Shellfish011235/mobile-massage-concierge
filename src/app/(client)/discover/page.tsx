import { TherapistDiscoveryCard } from "@/components/client/therapist-discovery-card";
import { listTherapistSummaries } from "@/data/mock-therapists";

export const metadata = {
  title: "Discover | Palm Concierge",
  description: "Browse independent licensed and insured massage professionals.",
};

export default function DiscoverPage() {
  const therapists = listTherapistSummaries();

  return (
    <div className="space-y-8">
      <div>
        <p className="pom-overline text-muted-foreground">Mobile massage</p>
        <h1 className="pom-display mt-2 text-pom-3xl text-foreground md:text-pom-4xl">
          Discover your therapist
        </h1>
        <p className="mt-3 max-w-pom-readable text-pom-base text-muted-foreground">
          Palm Concierge connects you with independent professionals. Each therapist is licensed and
          carries insurance verified by our team.
        </p>
      </div>
      <ul className="space-y-5">
        {therapists.map((t) => (
          <li key={t.id}>
            <TherapistDiscoveryCard therapist={t} />
          </li>
        ))}
      </ul>
    </div>
  );
}
