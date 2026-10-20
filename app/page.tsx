import HeroSection from "@/components/HeroSection";
import HotCategories from "@/components/HotCategories";
import AboutSection from "@/components/AboutSection";
import ProductShowcase from "@/components/ProductShowcase";
import { FeaturesMarquee } from "@/components/common/FeaturesMarquee";
import type { ApiBanner } from "@/lib/api";
import { backendGet } from "@/lib/serverBackend";

/** Home banners fetched on the server so the hero image is in the first HTML. `null` = backend unreachable. */
async function getHomeBanners(): Promise<ApiBanner[] | null> {
  const data = await backendGet<ApiBanner[] | { banners: ApiBanner[] }>("/api/banners?position=HOME");
  if (!data) return null;
  const list = Array.isArray(data) ? data : data.banners ?? [];
  return list.filter((b) => b.isActive);
}

export default async function Home() {
  const banners = await getHomeBanners();
  return (
    <div className="w-full flex flex-col min-h-screen">
      <h1 className="sr-only">Kiddos Foods — traditional batters, millet foods, cold-pressed oils and spices</h1>
      <HeroSection initialBanners={banners} />
      <HotCategories />
      <FeaturesMarquee />
      <AboutSection />
      <ProductShowcase />
    </div>
  );
}
