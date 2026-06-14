import AboutIntro from "../../components/AboutIntro";
import WhatWeDo from "../../components/WhatWeDo";
import PageHeader from "@/components/common/PageHeader";
import FeatureBadges from "@/components/FeatureBadges";
import FAQPage from "../faqs/page";
import Cta from "@/components/franchises/FranchiseCTA";
import HealthyPosterity from "@/components/HealthyPosterity";

export default function AboutPage() {
  return (
    <main>
      <PageHeader title="About Us" />
      <AboutIntro />
      <FeatureBadges />
      <HealthyPosterity />
      <Cta/>
      <WhatWeDo />
      <FAQPage />
    </main>
  );
}
