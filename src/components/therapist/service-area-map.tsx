import { Car, Home, MapPin } from "lucide-react";

/** Static map-style panel — swap for Mapbox/Google when keys are configured */
export function ServiceAreaMap() {
  return (
    <div className="overflow-hidden rounded-pom-2xl border border-border/80 bg-card shadow-pom-1 shadow-pom-inner">
      <div className="relative aspect-[16/10] w-full bg-gradient-to-br from-pom-palm-subtle via-pom-canvas-subtle to-pom-seaglass-subtle">
        {/* soft terrain texture */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.35) 0%, transparent 40%)",
          }}
        />

        {/* service radius */}
        <div className="absolute left-1/2 top-1/2 size-[72%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pom-seaglass/20 ring-2 ring-pom-seaglass/25" />

        {/* you */}
        <div className="absolute left-[46%] top-[48%] flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-pom-1">
          <Car className="size-5" aria-hidden />
        </div>

        {/* job pins */}
        <div className="absolute right-[22%] top-[32%] flex size-9 items-center justify-center rounded-full bg-card text-foreground shadow-pom-1">
          <Home className="size-4" aria-hidden />
        </div>
        <div className="absolute left-[28%] top-[38%] flex size-8 items-center justify-center rounded-full bg-card/95 text-primary shadow-pom-1">
          <MapPin className="size-4" aria-hidden />
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-pom-pill bg-card/95 px-3 py-1.5 text-pom-xs font-medium text-foreground shadow-pom-1 backdrop-blur-sm">
          <Car className="size-3.5 text-primary" aria-hidden />
          10 mi radius
        </div>
      </div>
    </div>
  );
}
