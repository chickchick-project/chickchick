import { TPerfumeDetail } from "@/lib/types/perfumeDetail";
import { PerfumeOverview } from "./overview";

// temp
// sematic tag 적용하기 (하위 컴포넌트 전부)

export const DetailClient = ({
  perfumeDetail,
}: {
  perfumeDetail: TPerfumeDetail;
}) => {
  return (
    <div>
      <PerfumeOverview perfumeDetail={perfumeDetail} />
    </div>
  );
};
