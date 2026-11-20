export interface PriceReference {
  grainType: "GKP" | "GKG";
  lowerBound: number;
  upperBound: number;
  medianPrice: number;
  toleranceDelta: number;
  region: string;
  sourceNote: string;
  updatedAt: string;
}

const REGIONAL_BENCHMARKS: Record<string, { GKP: { lower: number; upper: number }; GKG: { lower: number; upper: number } }> = {
  default: {
    GKP: { lower: 6800, upper: 7400 },
    GKG: { lower: 8000, upper: 8700 },
  },
  Subang: {
    GKP: { lower: 6900, upper: 7450 },
    GKG: { lower: 8100, upper: 8800 },
  },
  Karawang: {
    GKP: { lower: 7000, upper: 7600 },
    GKG: { lower: 8200, upper: 8900 },
  },
  Indramayu: {
    GKP: { lower: 6750, upper: 7350 },
    GKG: { lower: 7950, upper: 8600 },
  },
};

export class PriceReferenceService {
  static getReference(grainType: "GKP" | "GKG" = "GKP", region: string = "Subang"): PriceReference {
    const matched = REGIONAL_BENCHMARKS[region] || REGIONAL_BENCHMARKS.default;
    const bounds = grainType === "GKG" ? matched.GKG : matched.GKP;

    return {
      grainType,
      lowerBound: bounds.lower,
      upperBound: bounds.upper,
      medianPrice: Math.round((bounds.lower + bounds.upper) / 2),
      toleranceDelta: 0.03, // 3%
      region,
      sourceNote: "Berdasarkan pemantauan pasar berkala dan acuan Badan Pangan Nasional",
      updatedAt: "20 November 2026",
    };
  }
}
