import type { Metadata } from "next";
import PriceMapSection from "../_sections/price-map";
import PriceBoardSection from "../_sections/price-board";
import WorkspaceCtaSection from "../_sections/workspace-cta";

export const metadata: Metadata = {
  title: "Peta & Papan Harga | Sambung",
  description:
    "Sebaran harga gabah di 34 provinsi dan transparansi transmisi rantai pasok dari petani hingga konsumen.",
};

export default function PetaHargaPage() {
  return (
    <div className="w-full py-8 sm:py-12 space-y-12 sm:space-y-16">
      <PriceMapSection />
      <PriceBoardSection />
      <WorkspaceCtaSection />
    </div>
  );
}
