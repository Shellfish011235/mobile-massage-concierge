import { Award, BarChart3, BedDouble, CircleDollarSign } from "lucide-react";

const items = [
  {
    label: "Rates & services",
    Icon: CircleDollarSign,
    accent: "text-primary",
    bg: "bg-pom-palm-subtle",
  },
  {
    label: "Certifications",
    Icon: Award,
    accent: "text-pom-seaglass",
    bg: "bg-pom-seaglass-subtle",
  },
  {
    label: "Space needs",
    Icon: BedDouble,
    accent: "text-foreground",
    bg: "bg-muted",
  },
  {
    label: "Income & stats",
    Icon: BarChart3,
    accent: "text-pom-ink-secondary",
    bg: "bg-pom-champagne",
  },
] as const;

export function ProfileQuickGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
      {items.map(({ label, Icon, accent, bg }) => (
        <button
          key={label}
          type="button"
          className="flex flex-col items-center gap-2.5 rounded-pom-xl border border-border/80 bg-card p-3.5 text-center text-foreground shadow-pom-inner transition-colors duration-pom hover:border-border hover:bg-pom-surface-raised"
        >
          <span className={`flex size-11 items-center justify-center rounded-pom-lg ${bg} ${accent}`}>
            <Icon className="size-5" strokeWidth={1.75} aria-hidden />
          </span>
          <span className="text-pom-xs font-medium leading-tight text-muted-foreground">{label}</span>
        </button>
      ))}
    </div>
  );
}
