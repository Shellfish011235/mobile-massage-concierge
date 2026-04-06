import { LuxuryHero } from "@/components/marketing/luxury-hero";
import { LuxuryNav } from "@/components/marketing/luxury-nav";
import {
  LuxuryDarkBand,
  LuxuryExperience,
  LuxuryFooter,
  LuxuryPillars,
  LuxuryQuote,
  LuxuryReserve,
} from "@/components/marketing/luxury-sections";

export default function HomePage() {
  return (
    <>
      <LuxuryNav />
      <LuxuryHero />
      <LuxuryExperience />
      <LuxuryPillars />
      <LuxuryDarkBand />
      <LuxuryQuote />
      <LuxuryReserve />
      <LuxuryFooter />
    </>
  );
}
