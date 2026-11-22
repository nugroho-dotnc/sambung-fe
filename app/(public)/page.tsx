import HeroSection from "./_sections/hero";
import PillarsSection from "./_sections/pillars";
import PriceBoardSection from "./_sections/price-board";
import PriceMapSection from "./_sections/price-map";
import FairPriceSection from "./_sections/fair-price";
import WorkspaceCtaSection from "./_sections/workspace-cta";

export default function HomePage() {
  return (
    <div className="w-full sm:py-16 space-y-8 md:space-y-16">
      <HeroSection />

      <PillarsSection />

      <PriceBoardSection />

      <PriceMapSection />

      <FairPriceSection />

      <WorkspaceCtaSection />
    </div>
  );
}
