import AboutIntro from "../../components/AboutIntro";
import WhatWeDo from "../../components/WhatWeDo";
import PageHeader from "@/components/common/PageHeader";
import FeatureBadges from "@/components/FeatureBadges";

export default function AboutPage() {
  return (
    <main>
      <PageHeader title="About Us" />
      <AboutIntro />
      <FeatureBadges />
      <WhatWeDo />
    </main>
  );
}
