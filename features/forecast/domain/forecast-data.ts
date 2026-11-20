/**
 * Domain model and seed data for AI Price Forecasting & Explainability (PB-04).
 * Adheres to Clean Code principles and strict copywriting rules (no raw math jargon in UI).
 */

export interface ShapFactor {
  feature: string;
  impact: number; // positive = pushes price up, negative = pushes price down
  description: string;
  category: "cuaca" | "kebijakan" | "panen" | "logistik";
}

export interface ForecastRecord {
  id: string;
  horizonWeeks: 2 | 4;
  province: string;
  commodity: string;
  targetDate: string;
  riceProducerPrice: number;
  confidenceInterval80: [number, number];
  gkpEstimate: number;
  gkgEstimate: number;
  method: string;
  isFallback: boolean;
  shapContributions: ShapFactor[];
  historicalSeries: { week: string; actualPrice?: number; forecastPrice?: number; lowerCi?: number; upperCi?: number }[];
}

export const SEED_FORECASTS: ForecastRecord[] = [
  // Horizon 2 Pekan - Jawa Barat
  {
    id: "fc-jb-2w",
    horizonWeeks: 2,
    province: "Jawa Barat",
    commodity: "Beras Medium I",
    targetDate: "Pekan Ke-2 Desember 2026",
    riceProducerPrice: 14650,
    confidenceInterval80: [14200, 15100],
    gkpEstimate: 7250,
    gkgEstimate: 8350,
    method: "Model Prediksi AI (Tervalidasi)",
    isFallback: false,
    shapContributions: [
      {
        feature: "Curah Hujan & Musim Basah",
        impact: 85,
        category: "cuaca",
        description: "Hujan lokal yang meningkat memperlambat pengeringan alami gabah, menahan pasokan siap giling.",
      },
      {
        feature: "Luas Panen Sentra Pantura",
        impact: -120,
        category: "panen",
        description: "Mulai masuknya panen awal di Subang dan Indramayu menambah pasokan gabah di pasar.",
      },
      {
        feature: "Penyaluran Cadangan Bulog",
        impact: -60,
        category: "kebijakan",
        description: "Operasi pasar stabilisasi harga pemerintah meredam potensi lonjakan harga beras di tingkat penggilingan.",
      },
      {
        feature: "Biaya Bahan Bakar & Angkut",
        impact: 45,
        category: "logistik",
        description: "Biaya logistik antarkabupaten mengalami sedikit penyesuaian seiring permintaan jelang akhir tahun.",
      },
    ],
    historicalSeries: [
      { week: "Pekan -3", actualPrice: 14350 },
      { week: "Pekan -2", actualPrice: 14420 },
      { week: "Pekan -1", actualPrice: 14500 },
      { week: "Saat Ini", actualPrice: 14550, forecastPrice: 14550, lowerCi: 14550, upperCi: 14550 },
      { week: "+1 Pekan", forecastPrice: 14600, lowerCi: 14350, upperCi: 14850 },
      { week: "+2 Pekan", forecastPrice: 14650, lowerCi: 14200, upperCi: 15100 },
    ],
  },
  // Horizon 4 Pekan - Jawa Barat
  {
    id: "fc-jb-4w",
    horizonWeeks: 4,
    province: "Jawa Barat",
    commodity: "Beras Medium I",
    targetDate: "Pekan Ke-4 Desember 2026",
    riceProducerPrice: 14800,
    confidenceInterval80: [14100, 15500],
    gkpEstimate: 7350,
    gkgEstimate: 8450,
    method: "Model Prediksi AI (Tervalidasi)",
    isFallback: false,
    shapContributions: [
      {
        feature: "Lonjakan Permintaan Akhir Tahun",
        impact: 140,
        category: "kebijakan",
        description: "Peningkatan konsumsi masyarakat menjelang libur akhir tahun memicu permintaan gabah dari penggilingan.",
      },
      {
        feature: "Puncak Musim Hujan Wilayah Barat",
        impact: 110,
        category: "cuaca",
        description: "Tingginya curah hujan meningkatkan biaya pengeringan buatan (dryer) di pabrik penggilingan padi.",
      },
      {
        feature: "Ketersediaan Stok Gudang Penggilingan",
        impact: -90,
        category: "panen",
        description: "Cadangan gabah hasil panen sebelumnya masih mencukupi untuk memenuhi kebutuhan kapasitas giling.",
      },
    ],
    historicalSeries: [
      { week: "Pekan -3", actualPrice: 14350 },
      { week: "Pekan -2", actualPrice: 14420 },
      { week: "Pekan -1", actualPrice: 14500 },
      { week: "Saat Ini", actualPrice: 14550, forecastPrice: 14550, lowerCi: 14550, upperCi: 14550 },
      { week: "+1 Pekan", forecastPrice: 14600, lowerCi: 14350, upperCi: 14850 },
      { week: "+2 Pekan", forecastPrice: 14650, lowerCi: 14200, upperCi: 15100 },
      { week: "+3 Pekan", forecastPrice: 14720, lowerCi: 14150, upperCi: 15300 },
      { week: "+4 Pekan", forecastPrice: 14800, lowerCi: 14100, upperCi: 15500 },
    ],
  },
  // Horizon 2 Pekan - Jawa Tengah
  {
    id: "fc-jt-2w",
    horizonWeeks: 2,
    province: "Jawa Tengah",
    commodity: "Beras Medium I",
    targetDate: "Pekan Ke-2 Desember 2026",
    riceProducerPrice: 14300,
    confidenceInterval80: [13900, 14700],
    gkpEstimate: 7100,
    gkgEstimate: 8150,
    method: "Model Prediksi AI (Tervalidasi)",
    isFallback: false,
    shapContributions: [
      {
        feature: "Panen Raya Sentra Sragen & Demak",
        impact: -150,
        category: "panen",
        description: "Arus gabah melimpah dari panen serentak menekan harga beli di tingkat penggilingan padi.",
      },
      {
        feature: "Permintaan Pasokan Luar Provinsi",
        impact: 70,
        category: "logistik",
        description: "Pengiriman beras ke wilayah aglomerasi Jabodetabek menjaga harga tidak jatuh terlalu dalam.",
      },
    ],
    historicalSeries: [
      { week: "Pekan -3", actualPrice: 14100 },
      { week: "Pekan -2", actualPrice: 14180 },
      { week: "Pekan -1", actualPrice: 14220 },
      { week: "Saat Ini", actualPrice: 14250, forecastPrice: 14250, lowerCi: 14250, upperCi: 14250 },
      { week: "+1 Pekan", forecastPrice: 14270, lowerCi: 14000, upperCi: 14550 },
      { week: "+2 Pekan", forecastPrice: 14300, lowerCi: 13900, upperCi: 14700 },
    ],
  },
];
