"use client";

import { motion } from "framer-motion";
import { Ban, Check } from "lucide-react";
import { useState } from "react";

const spring = { type: "spring" as const, stiffness: 420, damping: 32 };

export function DutyToggle() {
  const [onDuty, setOnDuty] = useState(true);

  return (
    <div className="grid grid-cols-2 gap-3">
      <motion.button
        type="button"
        onClick={() => setOnDuty(true)}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        className={`touch-manipulation flex min-h-pom-touch items-center justify-center gap-2 rounded-pom-pill px-2 text-pom-sm font-semibold tracking-wide transition-colors duration-pom ${
          onDuty
            ? "bg-primary text-primary-foreground shadow-pom-1"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Check className="size-4 shrink-0" strokeWidth={2.5} />
        ON THE CLOCK
      </motion.button>
      <motion.button
        type="button"
        onClick={() => setOnDuty(false)}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        className={`touch-manipulation flex min-h-pom-touch items-center justify-center gap-2 rounded-pom-pill px-2 text-pom-sm font-semibold tracking-wide transition-colors duration-pom ${
          !onDuty
            ? "bg-foreground text-background shadow-pom-1"
            : "bg-muted text-muted-foreground"
        }`}
      >
        <Ban className="size-4 shrink-0" strokeWidth={2.5} />
        OFF DUTY
      </motion.button>
    </div>
  );
}
