/**
 * Services and pricing configured by a therapist.
 */

export type PricingType = "flat" | "duration_based" | "service_specific";

/** Minutes → price in smallest currency unit (e.g. cents) or decimal per your DB convention */
export type DurationPriceMap = Record<string, number>;

export interface ServiceAddOn {
  id: string;
  name: string;
  description: string | null;
  price: number;
  active: boolean;
}

export interface ServiceOffering {
  id: string;
  therapistId: string;
  name: string;
  description: string | null;
  /** Allowed session lengths in minutes */
  durationOptions: number[];
  pricingType: PricingType;
  /** Base or starting price (currency units as agreed for the app) */
  basePrice: number;
  /** Used when pricingType is duration_based */
  durationPriceMap: DurationPriceMap;
  addOns: ServiceAddOn[];
}
