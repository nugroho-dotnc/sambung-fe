import HeroSection from "./_sections/hero";
import PillarsSection from "./_sections/pillars";
import PriceBoardSection from "./_sections/price-board";
import PriceMapSection from "./_sections/price-map";
import FairPriceSection from "./_sections/fair-price";
import WorkspaceCtaSection from "./_sections/workspace-cta";

export default function HomePage() {
  return (
    <div className="w-full sm:py-16">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Tiga Pilar Keunggulan SAMBUNG */}
      <PillarsSection />

      {/* 3. Papan Rantai Harga 2 Sisi (#rantai-harga) */}
      <PriceBoardSection />

      {/* 4. Peta Sebaran Disparitas Regional (#peta-sebaran) */}
      <PriceMapSection />

      {/* 5. Kalkulator Acuan Harga Wajar (#harga-wajar) */}
      <FairPriceSection />

      {/* 6. Banner Ruang Kerja Petani & Penggilingan */}
      <WorkspaceCtaSection />
    </div>
  );
}
