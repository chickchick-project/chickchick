import {
  IPerfumeDetail,
  IPerfumeDetailResponse,
} from "@/lib/types/perfumeDetail";
import { createApiBrowserClient } from "@/lib/utils/core-request/browserClient";
import { useQuery } from "@tanstack/react-query";
import { PerfumeImage } from "./perfumeImage";
import { InteractionStates, PerfumeInfo } from "./perfumeInfo";

interface PerfumeOverviewProps {
  perfumeId: string;
  interactionStates: InteractionStates;
  onToggleInteraction: (type: keyof InteractionStates) => void;
}

export const PerfumeOverview = ({
  perfumeId,
  interactionStates,
  onToggleInteraction,
}: PerfumeOverviewProps) => {
  const api = createApiBrowserClient();

  const { data: perfumeDetail } = useQuery({
    queryKey: ["perfume", perfumeId, "detail"],
    queryFn: () =>
      api.get<IPerfumeDetailResponse, IPerfumeDetail>(
        `/perfumes/${perfumeId}`,
        undefined,
        {
          transformResponse: (res) => res.data,
        }
      ),
  });

  const imageUrl = perfumeDetail?.perfumeImage?.imageUrl ?? "";
  const imageAlt = perfumeDetail?.nameEn ?? "";

  console.log(perfumeDetail);

  return (
    <section className="w-full flex flex-col gap-10 tablet:grid tablet:grid-cols-[minmax(0,400px)_1fr]">
      <PerfumeImage src={imageUrl} alt={imageAlt} />
      {perfumeDetail && (
        <PerfumeInfo
          perfumeInfo={perfumeDetail}
          interactionStates={interactionStates}
          onToggleInteraction={onToggleInteraction}
        />
      )}
    </section>
  );
};
