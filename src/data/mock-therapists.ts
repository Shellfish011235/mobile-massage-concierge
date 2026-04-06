import type { TherapistProfile } from "@/types/therapist-profile";
import type { TherapistProfileSummary } from "@/types/therapist-profile";

const now = new Date().toISOString();

export const MOCK_THERAPISTS: TherapistProfile[] = [
  {
    id: "tp_elena",
    userId: "usr_elena",
    displayName: "Elena",
    photoUrl: null,
    bio: "Licensed massage therapist specializing in deep tissue and restorative Swedish. Hotel and residential visits across the metro.",
    yearsExperience: 9,
    licenseNumber: "MT-48291",
    licenseVerified: true,
    insuranceVerified: true,
    licenseDocumentUrl: null,
    insuranceDocumentUrl: null,
    specialties: ["Deep tissue", "Swedish", "Sports recovery"],
    certifications: ["NCBTMB", "CPR"],
    services: [
      {
        id: "svc_elena_1",
        therapistId: "tp_elena",
        name: "Signature deep restoration",
        description: "Full-body focused work with emphasis on neck, shoulders, and lower back.",
        durationOptions: [60, 90, 120],
        pricingType: "duration_based",
        basePrice: 19500,
        durationPriceMap: { "60": 19500, "90": 26500, "120": 33500 },
        addOns: [
          {
            id: "addon_elena_scalp",
            name: "Scalp release",
            description: null,
            price: 2500,
            active: true,
          },
        ],
      },
    ],
    travelRadiusMiles: 18,
    acceptsHome: true,
    acceptsHotel: true,
    acceptsOffice: true,
    acceptsEvents: false,
    acceptsValetJobs: true,
    availabilityStatus: "on_duty",
    ratingAverage: 4.92,
    ratingCount: 128,
    isApproved: true,
    city: "Miami",
    state: "FL",
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tp_marcus",
    userId: "usr_marcus",
    displayName: "Marcus",
    photoUrl: null,
    bio: "Therapeutic and sports massage for travelers and athletes. Calm, efficient setup in any space.",
    yearsExperience: 6,
    licenseNumber: "MT-51002",
    licenseVerified: true,
    insuranceVerified: true,
    licenseDocumentUrl: null,
    insuranceDocumentUrl: null,
    specialties: ["Sports", "Myofascial", "Stretching"],
    certifications: ["BCTMB"],
    services: [
      {
        id: "svc_marcus_1",
        therapistId: "tp_marcus",
        name: "Athletic recovery session",
        description: "Targeted work for legs, hips, and shoulders after travel or training.",
        durationOptions: [60, 90],
        pricingType: "duration_based",
        basePrice: 18500,
        durationPriceMap: { "60": 18500, "90": 24800 },
        addOns: [],
      },
    ],
    travelRadiusMiles: 12,
    acceptsHome: true,
    acceptsHotel: true,
    acceptsOffice: true,
    acceptsEvents: true,
    acceptsValetJobs: true,
    availabilityStatus: "busy",
    ratingAverage: 4.88,
    ratingCount: 84,
    isApproved: true,
    city: "Miami",
    state: "FL",
    active: true,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "tp_sofia",
    userId: "usr_sofia",
    displayName: "Sofia",
    photoUrl: null,
    bio: "Spa-trained therapist focused on nervous system down-regulation and gentle, precise pressure.",
    yearsExperience: 11,
    licenseNumber: "MT-39920",
    licenseVerified: true,
    insuranceVerified: true,
    licenseDocumentUrl: null,
    insuranceDocumentUrl: null,
    specialties: ["Swedish", "Prenatal", "Aromatherapy"],
    certifications: ["NCBTMB", "Prenatal certified"],
    services: [
      {
        id: "svc_sofia_1",
        therapistId: "tp_sofia",
        name: "Calm Swedish ritual",
        description: "Slow, full-body flow with optional light aromatherapy.",
        durationOptions: [60, 90, 120],
        pricingType: "duration_based",
        basePrice: 21000,
        durationPriceMap: { "60": 21000, "90": 28500, "120": 36000 },
        addOns: [
          {
            id: "addon_sofia_aroma",
            name: "Aromatherapy",
            description: null,
            price: 1500,
            active: true,
          },
        ],
      },
    ],
    travelRadiusMiles: 22,
    acceptsHome: true,
    acceptsHotel: true,
    acceptsOffice: false,
    acceptsEvents: false,
    acceptsValetJobs: false,
    availabilityStatus: "on_duty",
    ratingAverage: 4.96,
    ratingCount: 201,
    isApproved: true,
    city: "Coral Gables",
    state: "FL",
    active: true,
    createdAt: now,
    updatedAt: now,
  },
];

function priceStartingAt(t: TherapistProfile): number | null {
  const mins = t.services.flatMap((s) => s.durationOptions);
  if (mins.length === 0) return null;
  const minMin = Math.min(...mins);
  let best: number | null = null;
  for (const s of t.services) {
    if (s.pricingType === "duration_based") {
      const p = s.durationPriceMap[String(minMin)];
      if (p != null) best = best == null ? p : Math.min(best, p);
    } else {
      best = best == null ? s.basePrice : Math.min(best, s.basePrice);
    }
  }
  return best;
}

export function listTherapistSummaries(): TherapistProfileSummary[] {
  return MOCK_THERAPISTS.filter((t) => t.isApproved && t.active).map((t) => ({
    id: t.id,
    userId: t.userId,
    displayName: t.displayName,
    photoUrl: t.photoUrl,
    specialties: t.specialties,
    yearsExperience: t.yearsExperience,
    availabilityStatus: t.availabilityStatus,
    ratingAverage: t.ratingAverage,
    ratingCount: t.ratingCount,
    licenseVerified: t.licenseVerified,
    insuranceVerified: t.insuranceVerified,
    travelRadiusMiles: t.travelRadiusMiles,
    acceptsHome: t.acceptsHome,
    acceptsHotel: t.acceptsHotel,
    acceptsOffice: t.acceptsOffice,
    acceptsEvents: t.acceptsEvents,
    active: t.active,
    isApproved: t.isApproved,
    priceStartingAt: priceStartingAt(t),
    distanceMiles: 3.2 + MOCK_THERAPISTS.indexOf(t) * 1.4,
  }));
}

export function getTherapistById(id: string): TherapistProfile | undefined {
  return MOCK_THERAPISTS.find((t) => t.id === id);
}
