import { TPerfumeDetail } from "@/lib/types/perfumeDetail";
import { PerfumeImage } from "./perfumeImage";
import { PerfumeInfo } from "./perfumeInfo";

export const PerfumeOverview = ({
  perfumeDetail,
}: {
  perfumeDetail: TPerfumeDetail;
}) => {
  const { imageUrl, ...perfumeInfo } = perfumeDetail;

  return (
    <section className="w-full flex flex-col gap-10 tablet:grid tablet:grid-cols-[minmax(0,400px)_1fr]">
      <PerfumeImage src={imageUrl} alt={perfumeInfo.name} />
      <PerfumeInfo perfumeInfo={perfumeInfo} />
    </section>
  );
};
