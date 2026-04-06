"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export interface JobRequestPreview {
  id: string;
  title: string;
  distanceMiles: number;
  locationLine: string;
  priceLabel: string;
  avatarFallback: string;
  avatarClassName?: string;
}

export function JobRequestCard({
  title,
  distanceMiles,
  locationLine,
  priceLabel,
  avatarFallback,
  avatarClassName = "bg-pom-seaglass-subtle text-pom-seaglass",
}: JobRequestPreview) {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className="touch-manipulation flex w-full items-center gap-4 rounded-pom-2xl border border-border/80 bg-card p-4 text-left text-card-foreground shadow-pom-1 shadow-pom-inner ring-0 transition-shadow duration-pom hover:border-border hover:shadow-pom-2"
    >
      <div
        className={`flex size-12 shrink-0 items-center justify-center rounded-pom-xl text-pom-sm font-semibold ${avatarClassName}`}
      >
        {avatarFallback}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-pom-sm text-muted-foreground">
          {distanceMiles} mi · {locationLine}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-pom-sm font-semibold tabular-nums text-foreground">{priceLabel}</span>
        <ChevronRight className="size-5 text-muted-foreground/50" aria-hidden />
      </div>
    </motion.button>
  );
}
