/**
 * Pure domain logic for calculating fair grain price (PT-07 / PB-02a).
 * Clean Code: pure mathematical model, zero side-effects.
 */

export interface FairPriceCalculationInput {
  grainType: "GKP" | "GKG";
  region: string;
  ricePrice: number;
  rendemen?: number;
  moisturePercent?: number;
}

export interface FairPriceBreakdownResult {
  grainType: "GKP" | "GKG";
  region: string;
  ricePrice: number;
  rendemen: number;
  moisturePercent: number;
  lowerBound: number;
  upperBound: number;
  medianPrice: number;
  hppGovernment: number;
  millingMarginAmount: number;
  explanation: {
    grossValue: number;
    dryingAdjustment: number;
    netCalculated: number;
  };
}

export const DEFAULT_RENDEMEN: Record<"GKP" | "GKG", number> = {
  GKP: 0.5338, // 53.38% konversi standar gabah panen ke beras
  GKG: 0.63,   // 63.00% konversi gabah kering giling ke beras
};

export const GOVERNMENT_HPP: Record<"GKP" | "GKG", number> = {
  GKP: 6000, // HPP acuan Gabah Kering Panen
  GKG: 7200, // HPP acuan Gabah Kering Giling
};

export function calculateFairPriceBreakdown({
  grainType,
  region,
  ricePrice,
  rendemen = DEFAULT_RENDEMEN[grainType],
  moisturePercent = grainType === "GKP" ? 22 : 14,
}: FairPriceCalculationInput): FairPriceBreakdownResult {
  const safeRicePrice = Math.max(8000, ricePrice || 13500);

  // Nilai kotor gabah = Harga beras × rendemen
  const grossValue = Math.round(safeRicePrice * rendemen);

  // Penyesuaian kadar air (jika kadar air > standar, ada biaya susut pengeringan)
  const standardMoisture = grainType === "GKP" ? 20 : 14;
  const moistureDiff = Math.max(0, moisturePercent - standardMoisture);
  const dryingAdjustment = Math.round(moistureDiff * 45); // Rp45 per persen kelebihan kadar air

  // Biaya pengolahan rata-rata penggilingan
  const millingCost = grainType === "GKP" ? 350 : 200;

  const netCalculated = Math.max(4000, grossValue - dryingAdjustment - millingCost);

  // Batas toleransi rentang wajar (+/- 4% dari nilai median pasar)
  const lowerBound = Math.round((netCalculated * 0.96) / 50) * 50;
  const upperBound = Math.round((netCalculated * 1.04) / 50) * 50;
  const medianPrice = Math.round((lowerBound + upperBound) / 2);

  return {
    grainType,
    region,
    ricePrice: safeRicePrice,
    rendemen,
    moisturePercent,
    lowerBound,
    upperBound,
    medianPrice,
    hppGovernment: GOVERNMENT_HPP[grainType],
    millingMarginAmount: millingCost,
    explanation: {
      grossValue,
      dryingAdjustment,
      netCalculated,
    },
  };
}
