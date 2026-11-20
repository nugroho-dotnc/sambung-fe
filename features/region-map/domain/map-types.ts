/**
 * Domain types and data for Provincial Price Disparity (PB-03).
 */

export interface ProvincialPriceComparison {
  province: string;
  price: number;
  medianPrice: number;
  percentageDiff: number;
  grainType: string;
  isAvailable: boolean;
  sampleCount: number;
  status: "above" | "below" | "normal";
}

export const SEED_PROVINCIAL_DATA: ProvincialPriceComparison[] = [
  { province: "Aceh", price: 6500, medianPrice: 6700, percentageDiff: -2.99, grainType: "GKP", isAvailable: true, sampleCount: 14, status: "below" },
  { province: "Sumatera Utara", price: 6850, medianPrice: 6700, percentageDiff: 2.24, grainType: "GKP", isAvailable: true, sampleCount: 22, status: "above" },
  { province: "Sumatera Barat", price: 6900, medianPrice: 6700, percentageDiff: 2.99, grainType: "GKP", isAvailable: true, sampleCount: 18, status: "above" },
  { province: "Riau", price: 7100, medianPrice: 6700, percentageDiff: 5.97, grainType: "GKP", isAvailable: true, sampleCount: 8, status: "above" },
  { province: "Jambi", price: 6750, medianPrice: 6700, percentageDiff: 0.75, grainType: "GKP", isAvailable: true, sampleCount: 10, status: "normal" },
  { province: "Sumatera Selatan", price: 6450, medianPrice: 6700, percentageDiff: -3.73, grainType: "GKP", isAvailable: true, sampleCount: 30, status: "below" },
  { province: "Bengkulu", price: 6600, medianPrice: 6700, percentageDiff: -1.49, grainType: "GKP", isAvailable: true, sampleCount: 6, status: "normal" },
  { province: "Lampung", price: 6550, medianPrice: 6700, percentageDiff: -2.24, grainType: "GKP", isAvailable: true, sampleCount: 26, status: "below" },
  { province: "Kepulauan Bangka Belitung", price: 7300, medianPrice: 6700, percentageDiff: 8.96, grainType: "GKP", isAvailable: true, sampleCount: 4, status: "above" },
  { province: "Kepulauan Riau", price: 7450, medianPrice: 6700, percentageDiff: 11.19, grainType: "GKP", isAvailable: true, sampleCount: 3, status: "above" },
  { province: "DKI Jakarta", price: 7500, medianPrice: 6700, percentageDiff: 11.94, grainType: "GKP", isAvailable: true, sampleCount: 2, status: "above" },
  { province: "Jawa Barat", price: 7200, medianPrice: 6700, percentageDiff: 7.46, grainType: "GKP", isAvailable: true, sampleCount: 48, status: "above" },
  { province: "Jawa Tengah", price: 6800, medianPrice: 6700, percentageDiff: 1.49, grainType: "GKP", isAvailable: true, sampleCount: 52, status: "normal" },
  { province: "DI Yogyakarta", price: 6900, medianPrice: 6700, percentageDiff: 2.99, grainType: "GKP", isAvailable: true, sampleCount: 16, status: "above" },
  { province: "Jawa Timur", price: 6750, medianPrice: 6700, percentageDiff: 0.75, grainType: "GKP", isAvailable: true, sampleCount: 58, status: "normal" },
  { province: "Banten", price: 7150, medianPrice: 6700, percentageDiff: 6.72, grainType: "GKP", isAvailable: true, sampleCount: 20, status: "above" },
  { province: "Bali", price: 7200, medianPrice: 6700, percentageDiff: 7.46, grainType: "GKP", isAvailable: true, sampleCount: 12, status: "above" },
  { province: "Nusa Tenggara Barat", price: 6350, medianPrice: 6700, percentageDiff: -5.22, grainType: "GKP", isAvailable: true, sampleCount: 28, status: "below" },
  { province: "Nusa Tenggara Timur", price: 6900, medianPrice: 6700, percentageDiff: 2.99, grainType: "GKP", isAvailable: true, sampleCount: 9, status: "above" },
  { province: "Kalimantan Barat", price: 6850, medianPrice: 6700, percentageDiff: 2.24, grainType: "GKP", isAvailable: true, sampleCount: 11, status: "above" },
  { province: "Kalimantan Tengah", price: 6700, medianPrice: 6700, percentageDiff: 0.0, grainType: "GKP", isAvailable: true, sampleCount: 9, status: "normal" },
  { province: "Kalimantan Selatan", price: 6500, medianPrice: 6700, percentageDiff: -2.99, grainType: "GKP", isAvailable: true, sampleCount: 24, status: "below" },
  { province: "Kalimantan Timur", price: 7250, medianPrice: 6700, percentageDiff: 8.21, grainType: "GKP", isAvailable: true, sampleCount: 7, status: "above" },
  { province: "Kalimantan Utara", price: 7350, medianPrice: 6700, percentageDiff: 9.70, grainType: "GKP", isAvailable: true, sampleCount: 3, status: "above" },
  { province: "Sulawesi Utara", price: 6950, medianPrice: 6700, percentageDiff: 3.73, grainType: "GKP", isAvailable: true, sampleCount: 8, status: "above" },
  { province: "Sulawesi Tengah", price: 6600, medianPrice: 6700, percentageDiff: -1.49, grainType: "GKP", isAvailable: true, sampleCount: 15, status: "normal" },
  { province: "Sulawesi Selatan", price: 6300, medianPrice: 6700, percentageDiff: -5.97, grainType: "GKP", isAvailable: true, sampleCount: 42, status: "below" },
  { province: "Sulawesi Tenggara", price: 6650, medianPrice: 6700, percentageDiff: -0.75, grainType: "GKP", isAvailable: true, sampleCount: 13, status: "normal" },
  { province: "Gorontalo", price: 6500, medianPrice: 6700, percentageDiff: -2.99, grainType: "GKP", isAvailable: true, sampleCount: 7, status: "below" },
  { province: "Sulawesi Barat", price: 6400, medianPrice: 6700, percentageDiff: -4.48, grainType: "GKP", isAvailable: true, sampleCount: 10, status: "below" },
  { province: "Maluku", price: 7400, medianPrice: 6700, percentageDiff: 10.45, grainType: "GKP", isAvailable: true, sampleCount: 4, status: "above" },
  { province: "Maluku Utara", price: 7450, medianPrice: 6700, percentageDiff: 11.19, grainType: "GKP", isAvailable: true, sampleCount: 3, status: "above" },
  { province: "Papua", price: 7600, medianPrice: 6700, percentageDiff: 13.43, grainType: "GKP", isAvailable: true, sampleCount: 4, status: "above" },
  { province: "Papua Barat", price: 7550, medianPrice: 6700, percentageDiff: 12.69, grainType: "GKP", isAvailable: true, sampleCount: 3, status: "above" },
];
