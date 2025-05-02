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
    <div>
      <PerfumeImage src={imageUrl} alt={perfumeInfo.name} />
      <PerfumeInfo perfumeInfo={perfumeInfo} />
    </div>
  );
};
