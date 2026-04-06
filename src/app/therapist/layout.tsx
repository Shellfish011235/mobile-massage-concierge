import { TherapistBottomNav } from "@/components/therapist/therapist-bottom-nav";
import { TherapistWheelSmooth } from "@/components/therapist/therapist-wheel-smooth";

export default function TherapistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-pom-canvas-muted font-sans text-foreground antialiased">
      <TherapistWheelSmooth />
      <div className="relative mx-auto min-h-dvh max-w-md bg-background shadow-pom-2 ring-1 ring-border/60">
        <div className="pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">{children}</div>
      </div>
      <TherapistBottomNav />
    </div>
  );
}
