import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        /** Semantic tokens — prefer for new UI */
        pom: {
          canvas: {
            DEFAULT: "hsl(var(--pom-canvas) / <alpha-value>)",
            subtle: "hsl(var(--pom-canvas-subtle) / <alpha-value>)",
            muted: "hsl(var(--pom-canvas-muted) / <alpha-value>)",
          },
          surface: {
            DEFAULT: "hsl(var(--pom-surface) / <alpha-value>)",
            raised: "hsl(var(--pom-surface-raised) / <alpha-value>)",
            overlay: "hsl(var(--pom-surface-overlay) / <alpha-value>)",
          },
          ink: {
            DEFAULT: "hsl(var(--pom-ink) / <alpha-value>)",
            secondary: "hsl(var(--pom-ink-secondary) / <alpha-value>)",
            tertiary: "hsl(var(--pom-ink-tertiary) / <alpha-value>)",
            muted: "hsl(var(--pom-ink-muted) / <alpha-value>)",
            inverse: "hsl(var(--pom-ink-inverse) / <alpha-value>)",
          },
          border: {
            DEFAULT: "hsl(var(--pom-border) / <alpha-value>)",
            strong: "hsl(var(--pom-border-strong) / <alpha-value>)",
          },
          divider: "hsl(var(--pom-divider) / <alpha-value>)",
          palm: {
            DEFAULT: "hsl(var(--pom-palm) / <alpha-value>)",
            muted: "hsl(var(--pom-palm-muted) / <alpha-value>)",
            subtle: "hsl(var(--pom-palm-subtle) / <alpha-value>)",
          },
          sage: {
            DEFAULT: "hsl(var(--pom-sage) / <alpha-value>)",
            subtle: "hsl(var(--pom-sage-subtle) / <alpha-value>)",
          },
          eucalyptus: {
            DEFAULT: "hsl(var(--pom-eucalyptus) / <alpha-value>)",
            subtle: "hsl(var(--pom-eucalyptus-subtle) / <alpha-value>)",
          },
          seaglass: {
            DEFAULT: "hsl(var(--pom-seaglass) / <alpha-value>)",
            muted: "hsl(var(--pom-seaglass-muted) / <alpha-value>)",
            subtle: "hsl(var(--pom-seaglass-subtle) / <alpha-value>)",
          },
          champagne: {
            DEFAULT: "hsl(var(--pom-champagne) / <alpha-value>)",
          },
          gold: {
            DEFAULT: "hsl(var(--pom-gold) / <alpha-value>)",
            subtle: "hsl(var(--pom-gold-subtle) / <alpha-value>)",
          },
          success: {
            DEFAULT: "hsl(var(--pom-success) / <alpha-value>)",
            subtle: "hsl(var(--pom-success-subtle) / <alpha-value>)",
            border: "hsl(var(--pom-success-border) / <alpha-value>)",
          },
          warning: {
            DEFAULT: "hsl(var(--pom-warning) / <alpha-value>)",
            subtle: "hsl(var(--pom-warning-subtle) / <alpha-value>)",
            border: "hsl(var(--pom-warning-border) / <alpha-value>)",
          },
          danger: {
            DEFAULT: "hsl(var(--pom-danger) / <alpha-value>)",
            subtle: "hsl(var(--pom-danger-subtle) / <alpha-value>)",
            border: "hsl(var(--pom-danger-border) / <alpha-value>)",
          },
          info: {
            DEFAULT: "hsl(var(--pom-info) / <alpha-value>)",
            subtle: "hsl(var(--pom-info-subtle) / <alpha-value>)",
            border: "hsl(var(--pom-info-border) / <alpha-value>)",
          },
          ring: "hsl(var(--pom-ring) / <alpha-value>)",
          "ring-offset": "hsl(var(--pom-ring-offset) / <alpha-value>)",
        },

        /** shadcn/ui — wired to CSS vars in pom-tokens */
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },

        ringOffsetColor: {
          background: "hsl(var(--background) / <alpha-value>)",
        },

        /** Legacy aliases — map to token-aligned hex for existing components */
        cream: {
          DEFAULT: "#f3efe8",
          100: "#ebe4d9",
          200: "#dfd6c8",
        },
        forest: {
          DEFAULT: "#5f7d64",
          600: "#547059",
          700: "#4a6550",
        },
        clay: {
          DEFAULT: "#a9635a",
          600: "#95564e",
        },
        sand: {
          50: "#faf8f5",
          100: "#f3efe6",
          200: "#e8e2d4",
        },
        palm: {
          500: "#5f7d64",
          600: "#547059",
          700: "#4a6550",
        },
        ocean: {
          500: "#6d8fa3",
          600: "#5c7d91",
        },
        ink: {
          700: "#4a4742",
          800: "#2e2c29",
        },
        onyx: {
          DEFAULT: "#1c1b19",
          50: "#f7f6f4",
          100: "#ebe9e6",
          800: "#2a2826",
        },
        champagne: {
          DEFAULT: "#f7f4ef",
          50: "#fdfcfa",
          100: "#f9f6f1",
        },
        gold: {
          DEFAULT: "#b69a6f",
          muted: "#8f7a5a",
        },
        mist: "#8f8b84",
      },
      spacing: {
        "gutter-x": "var(--pom-gutter-x)",
        "gutter-y": "var(--pom-gutter-y)",
        "section-y": "var(--pom-section-y)",
        px: "var(--pom-space-px)",
        0.5: "var(--pom-space-0-5)",
        1.5: "var(--pom-space-1-5)",
        2.5: "var(--pom-space-2-5)",
        3.5: "var(--pom-space-3-5)",
        5: "var(--pom-space-5)",
        6: "var(--pom-space-6)",
        7: "var(--pom-space-7)",
        8: "var(--pom-space-8)",
        9: "var(--pom-space-9)",
        10: "var(--pom-space-10)",
        11: "var(--pom-space-11)",
        12: "var(--pom-space-12)",
        14: "var(--pom-space-14)",
        16: "var(--pom-space-16)",
        20: "var(--pom-space-20)",
        24: "var(--pom-space-24)",
      },
      borderRadius: {
        "pom-sm": "var(--pom-radius-sm)",
        "pom-md": "var(--pom-radius-md)",
        "pom-lg": "var(--pom-radius-lg)",
        "pom-xl": "var(--pom-radius-xl)",
        "pom-2xl": "var(--pom-radius-2xl)",
        "pom-3xl": "var(--pom-radius-3xl)",
        "pom-pill": "var(--pom-radius-pill)",
        "pom-card": "var(--pom-radius-card)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "3xl": "1.25rem",
        "4xl": "1.5rem",
      },
      boxShadow: {
        "pom-0": "var(--pom-shadow-0)",
        "pom-1": "var(--pom-shadow-1)",
        "pom-2": "var(--pom-shadow-2)",
        "pom-3": "var(--pom-shadow-3)",
        "pom-4": "var(--pom-shadow-4)",
        "pom-inner": "var(--pom-shadow-inner-soft)",
        soft: "var(--pom-shadow-2)",
        card: "var(--pom-shadow-1), var(--pom-shadow-inner-soft)",
        luxury:
          "0 28px 90px hsl(var(--pom-shadow-color) / 0.14), 0 8px 24px hsl(var(--pom-shadow-color) / 0.06)",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      fontSize: {
        "pom-xs": [
          "var(--pom-text-xs)",
          { lineHeight: "var(--pom-leading-normal)" },
        ],
        "pom-sm": [
          "var(--pom-text-sm)",
          { lineHeight: "var(--pom-leading-relaxed)" },
        ],
        "pom-base": [
          "var(--pom-text-base)",
          { lineHeight: "var(--pom-leading-relaxed)" },
        ],
        "pom-md": [
          "var(--pom-text-md)",
          { lineHeight: "var(--pom-leading-relaxed)" },
        ],
        "pom-lg": [
          "var(--pom-text-lg)",
          { lineHeight: "var(--pom-leading-relaxed)" },
        ],
        "pom-xl": [
          "var(--pom-text-xl)",
          { lineHeight: "var(--pom-leading-snug)" },
        ],
        "pom-2xl": [
          "var(--pom-text-2xl)",
          { lineHeight: "var(--pom-leading-snug)" },
        ],
        "pom-3xl": [
          "var(--pom-text-3xl)",
          { lineHeight: "var(--pom-leading-tight)" },
        ],
        "pom-4xl": [
          "var(--pom-text-4xl)",
          { lineHeight: "var(--pom-leading-tight)" },
        ],
        "pom-5xl": [
          "var(--pom-text-5xl)",
          { lineHeight: "var(--pom-leading-tight)" },
        ],
        "pom-6xl": [
          "var(--pom-text-6xl)",
          { lineHeight: "var(--pom-leading-none)" },
        ],
      },
      maxWidth: {
        "pom-prose": "42rem",
        "pom-readable": "48rem",
        "pom-editorial": "72rem",
        "pom-shell": "28rem",
      },
      minHeight: {
        "pom-touch": "2.75rem",
        "pom-touch-sm": "2.25rem",
      },
      transitionDuration: {
        "pom-instant": "var(--pom-duration-instant)",
        "pom-fast": "var(--pom-duration-fast)",
        pom: "var(--pom-duration)",
        "pom-slow": "var(--pom-duration-slow)",
        "pom-slower": "var(--pom-duration-slower)",
      },
      transitionTimingFunction: {
        "pom-out": "var(--pom-ease-out)",
        "pom-in-out": "var(--pom-ease-in-out)",
      },
      keyframes: {
        "pom-fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "pom-fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "pom-fade-in": "pom-fade-in var(--pom-duration-slow) var(--pom-ease-out) both",
        "pom-fade-up": "pom-fade-up var(--pom-duration-slow) var(--pom-ease-out) both",
      },
    },
  },
  plugins: [],
};

export default config;
