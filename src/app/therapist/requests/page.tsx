import Link from "next/link";

export default function TherapistRequestsPage() {
  return (
    <main className="px-gutter-x pb-6 pt-[max(3rem,env(safe-area-inset-top,0px))]">
      <h1 className="font-serif text-2xl font-normal text-foreground">Requests</h1>
      <p className="mt-2 text-pom-sm text-muted-foreground">
        Full request queue and actions will live here.
      </p>
      <Link
        href="/therapist"
        className="mt-8 inline-block text-pom-sm font-medium text-primary underline-offset-4 transition-colors hover:text-foreground hover:underline"
      >
        Back to home
      </Link>
    </main>
  );
}
