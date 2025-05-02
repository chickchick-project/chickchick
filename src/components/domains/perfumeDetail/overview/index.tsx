import { TPerfumeDetail } from "@/lib/types/perfumeDetail";
import { PerfumeImage } from "./perfumeImage";

export const PerfumeOverview = ({
  perfumeDetail,
}: {
  perfumeDetail: TPerfumeDetail;
}) => {
  const { imageUrl, name } = perfumeDetail;

  return (
    <div>
      <PerfumeImage src={imageUrl} alt={name} />
    </div>
  );
};
