import type { ApiPerfumeDetailResponse } from "@/lib/hono/schemas/perfume.schema";
import { PerfumeImage } from "./perfumeImage";
import { InteractionStates, PerfumeInfo } from "./perfumeInfo";

interface PerfumeOverviewProps {
  perfumeDetail: ApiPerfumeDetailResponse;
  interactionStates: InteractionStates;
  onToggleInteraction: (type: keyof InteractionStates) => void;
}

export const PerfumeOverview = ({
  perfumeDetail,
  interactionStates,
  onToggleInteraction,
}: PerfumeOverviewProps) => {
  const imageUrl = perfumeDetail.perfumeImage?.imageUrl ?? "";
  const perfumeName = perfumeDetail.nameKo ?? perfumeDetail.nameEn;

  return (
    <section className="w-full flex flex-col gap-10 tablet:grid tablet:grid-cols-[minmax(0,400px)_1fr]">
      <PerfumeImage src={imageUrl} alt={perfumeName} />
      <PerfumeInfo
        perfumeDetail={perfumeDetail}
        interactionStates={interactionStates}
        onToggleInteraction={onToggleInteraction}
      />
    </section>
  );
};
