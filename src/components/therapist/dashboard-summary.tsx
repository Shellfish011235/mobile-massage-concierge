import { ClipboardList, MapPinned, MapPinHouse } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function DashboardSummary() {
  return (
    <Card className="overflow-hidden border-border/80 shadow-pom-1 shadow-pom-inner">
      <CardContent className="grid grid-cols-3 gap-0 p-0">
        <div className="px-3 py-4 text-center">
          <MapPinned
            className="mx-auto mb-2 size-5 text-primary"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-2xl font-semibold tabular-nums text-foreground">12</p>
          <p className="mt-1 text-pom-xs font-medium uppercase tracking-wide text-muted-foreground">
            Requests
          </p>
        </div>
        <div className="border-x border-border/70 px-3 py-4 text-center">
          <ClipboardList
            className="mx-auto mb-2 size-5 text-pom-seaglass"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-pom-sm font-semibold leading-snug text-foreground">60–90 min</p>
          <p className="mt-1 text-pom-xs font-medium uppercase tracking-wide text-muted-foreground">
            Durations
          </p>
        </div>
        <div className="px-3 py-4 text-center">
          <MapPinHouse
            className="mx-auto mb-2 size-5 text-muted-foreground"
            strokeWidth={1.5}
            aria-hidden
          />
          <p className="text-pom-xs font-semibold leading-snug text-foreground">
            Home · Hotel · Office
          </p>
          <p className="mt-1 text-pom-xs font-medium uppercase tracking-wide text-muted-foreground">
            Locations
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
