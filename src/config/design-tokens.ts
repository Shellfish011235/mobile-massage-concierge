/**
 * Runtime design tokens (Framer Motion, JS transitions).
 * CSS remains source of truth for color/spacing; keep durations in sync with pom-tokens.css.
 */
export const pomMotion = {
  easeOut: [0.22, 1, 0.36, 1] as const,
  easeInOut: [0.45, 0, 0.55, 1] as const,
  duration: {
    instant: 0.075,
    fast: 0.15,
    default: 0.22,
    slow: 0.34,
    slower: 0.48,
  },
} as const;

export type PomBookingStatusTone =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info";
