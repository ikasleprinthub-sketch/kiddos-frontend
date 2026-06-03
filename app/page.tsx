import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import PopularBatters from "@/components/PopularBatters";
import SpicesOils from "@/components/SpicesOils";
import TasteDifference from "@/components/TasteDifference";

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <HeroSection />
      <TasteDifference />
      <FeaturedProducts />
      <PopularBatters />
      <SpicesOils />
    </div>
  );
}
