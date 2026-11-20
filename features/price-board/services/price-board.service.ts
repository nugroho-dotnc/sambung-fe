import {
  SupplyChainComparison,
  HistoricalTrendPoint,
  calculateFarmerShare,
  calculateMargin,
} from "../domain/price-chain";

const REGIONAL_CHAIN_DATA: Record<string, { farmer: number; miller: number; wholesale: number; retail: number }> = {
  "Jawa Barat": { farmer: 12850, miller: 14420, wholesale: 14650, retail: 15400 },
  "Jawa Tengah": { farmer: 12600, miller: 14200, wholesale: 14450, retail: 15200 },
  "Jawa Timur": { farmer: 12730, miller: 14380, wholesale: 14590, retail: 15350 },
  "Nasional": { farmer: 12700, miller: 14300, wholesale: 14550, retail: 15300 },
};

const BASE_TREND_WEEKS: HistoricalTrendPoint[] = [
  { week: "Pekan 1", farmerPrice: 12400, millerPrice: 13950, retailPrice: 14900 },
  { week: "Pekan 2", farmerPrice: 12450, millerPrice: 14000, retailPrice: 14950 },
  { week: "Pekan 3", farmerPrice: 12500, millerPrice: 14100, retailPrice: 15000 },
  { week: "Pekan 4", farmerPrice: 12520, millerPrice: 14150, retailPrice: 15050 },
  { week: "Pekan 5", farmerPrice: 12580, millerPrice: 14200, retailPrice: 15100 },
  { week: "Pekan 6", farmerPrice: 12600, millerPrice: 14250, retailPrice: 15150 },
  { week: "Pekan 7", farmerPrice: 12650, millerPrice: 14280, retailPrice: 15200 },
  { week: "Pekan 8", farmerPrice: 12680, millerPrice: 14320, retailPrice: 15250 },
  { week: "Pekan 9", farmerPrice: 12700, millerPrice: 14350, retailPrice: 15280 },
  { week: "Pekan 10", farmerPrice: 12710, millerPrice: 14360, retailPrice: 15300 },
  { week: "Pekan 11", farmerPrice: 12720, millerPrice: 14370, retailPrice: 15320 },
  { week: "Pekan 12", farmerPrice: 12730, millerPrice: 14380, retailPrice: 15350 },
];

export class PriceBoardService {
  static getSupplyChainComparison(
    commodity: string = "Beras Medium I",
    region: string = "Jawa Barat",
    period: string = "12 Pekan Terakhir"
  ): SupplyChainComparison {
    const prices = REGIONAL_CHAIN_DATA[region] || REGIONAL_CHAIN_DATA["Jawa Barat"];

    // Commodity multiplier (premium has higher margin)
    const multiplier = commodity.includes("Premium") ? 1.08 : 1.0;

    const farmerPrice = Math.round(prices.farmer * multiplier);
    const millerPrice = Math.round(prices.miller * multiplier);
    const wholesalePrice = Math.round(prices.wholesale * multiplier);
    const retailPrice = Math.round(prices.retail * multiplier);

    const { marginAmount, marginPercent } = calculateMargin(farmerPrice, retailPrice);
    const farmerSharePercent = calculateFarmerShare(farmerPrice, retailPrice);

    return {
      commodity,
      region,
      period,
      farmerPrice,
      retailPrice,
      marginAmount,
      marginPercent,
      farmerSharePercent,
      updatedAt: "20 November 2026",
      levels: [
        {
          id: "petani",
          level: "Petani Gabah (Setara Beras)",
          price: farmerPrice,
          unit: "Rp/kg",
          note: "Konversi rendemen gabah ke beras ~53%",
          description: "Nilai yang diterima petani setelah dikonversi ke takaran ekuivalen beras.",
          category: "petani",
        },
        {
          id: "penggilingan",
          level: "Penggilingan Padi (Produsen)",
          price: millerPrice,
          unit: "Rp/kg",
          note: `Marjin pengolahan +Rp${(millerPrice - farmerPrice).toLocaleString("id-ID")}`,
          description: "Harga jual beras setelah proses pengeringan, penggilingan, dan pengemasan awal.",
          category: "penggilingan",
        },
        {
          id: "grosir",
          level: "Pedagang Besar / Pasar Induk",
          price: wholesalePrice,
          unit: "Rp/kg",
          note: `Logistik & bongkar muat +Rp${(wholesalePrice - millerPrice).toLocaleString("id-ID")}`,
          description: "Harga transaksi volume besar di pasar induk perdagangan antardaerah.",
          category: "grosir",
        },
        {
          id: "konsumen",
          level: "Pasar Eceran Konsumen (PIHPS)",
          price: retailPrice,
          unit: "Rp/kg",
          note: `Marjin ritel +Rp${(retailPrice - wholesalePrice).toLocaleString("id-ID")}`,
          description: "Harga akhir yang dibayarkan masyarakat di pasar tradisional dan modern.",
          category: "konsumen",
        },
      ],
    };
  }

  static getHistoricalTrends(region: string = "Jawa Barat"): HistoricalTrendPoint[] {
    const prices = REGIONAL_CHAIN_DATA[region] || REGIONAL_CHAIN_DATA["Jawa Barat"];
    const delta = prices.farmer - 12730;

    return BASE_TREND_WEEKS.map((point) => ({
      ...point,
      farmerPrice: point.farmerPrice + delta,
      millerPrice: point.millerPrice + delta,
      retailPrice: point.retailPrice + delta,
    }));
  }
}
