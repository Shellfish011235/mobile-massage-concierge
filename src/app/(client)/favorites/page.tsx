import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Saved | Palm Concierge",
};

export default function FavoritesPage() {
  return (
    <div className="space-y-6">
      <h1 className="pom-display text-pom-3xl text-foreground">Saved therapists</h1>
      <Card>
        <CardContent className="py-12 text-center text-pom-sm text-muted-foreground">
          <p>Favorites sync with your account in a future release.</p>
          <Link href="/discover" className="mt-4 inline-block font-medium text-primary hover:underline">
            Browse discovery
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
