import FranchiseHero from "@/components/franchises/FranchiseHero";
import PageHeader from "@/components/common/PageHeader";
import FranchiseProcess from "@/components/franchises/FranchiseProcess";
import FranchiseBenefits from "@/components/franchises/FranchiseBenefits";
import FranchiseExcellence from "@/components/franchises/FranchiseExcellence";
import FranchiseDownloads from "@/components/franchises/FranchiseDownloads";
import FranchiseForm from "@/components/franchises/FranchiseForm";
import FranchiseCTA from "@/components/franchises/FranchiseCTA";

export default function FranchisesPage() {
  return (
    <div className="w-full bg-[#faf8f5] dark:bg-[#061410] min-h-screen">
      <PageHeader title="Franchises" />
      <FranchiseHero />
      <FranchiseProcess />
      <FranchiseBenefits />
      <FranchiseCTA />
      <FranchiseExcellence />
      <FranchiseDownloads />
      <FranchiseForm />
    </div>
  );
}
