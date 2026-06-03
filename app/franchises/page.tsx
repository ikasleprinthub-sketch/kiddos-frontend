import FranchiseHero from "@/components/franchises/FranchiseHero";
import FranchiseBenefits from "@/components/franchises/FranchiseBenefits";
import FranchiseExcellence from "@/components/franchises/FranchiseExcellence";
import FranchiseDownloads from "@/components/franchises/FranchiseDownloads";
import FranchiseForm from "@/components/franchises/FranchiseForm";

export default function FranchisesPage() {
  return (
    <div className="w-full bg-[#faf8f5] dark:bg-[#061410] min-h-screen pb-20">
      <FranchiseHero />
      <FranchiseBenefits />
      <FranchiseExcellence />
      <FranchiseDownloads />
      <FranchiseForm />
    </div>
  );
}
