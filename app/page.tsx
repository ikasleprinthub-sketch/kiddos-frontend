import HeroSection from "@/components/HeroSection";
import TasteDifference from "@/components/TasteDifference";

export default function Home() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <HeroSection />
      <TasteDifference />
    </div>
  );
}
