import { TPerfumeDetail } from "@/lib/types/perfumeDetail";
import { PerfumeImage } from "./perfumeImage";
import { InteractionStates, PerfumeInfo } from "./perfumeInfo";

interface PerfumeOverviewProps {
  perfumeDetail: TPerfumeDetail;
  interactionStates: InteractionStates;
  onToggleInteraction: (type: keyof InteractionStates) => void;
}

export const PerfumeOverview = ({
  perfumeDetail,
  interactionStates,
  onToggleInteraction,
}: PerfumeOverviewProps) => {
  const { imageUrl, ...perfumeInfo } = perfumeDetail;

  return (
    <section className="w-full flex flex-col gap-10 tablet:grid tablet:grid-cols-[minmax(0,400px)_1fr]">
      <PerfumeImage src={imageUrl} alt={perfumeInfo.name} />
      <PerfumeInfo
        perfumeInfo={perfumeInfo}
        interactionStates={interactionStates}
        onToggleInteraction={onToggleInteraction}
      />
    </section>
  );
};
