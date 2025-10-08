import { MobileSeparator } from "@/components/commons/mobileSeparator";
import { ReviewAnalytics } from "./analytics";
import { ReviewList } from "./reviewList";
import { useQuery } from "@tanstack/react-query";
import { IReviewItem, IReviewsResponse } from "@/lib/types/perfumeReview";
import { createApiBrowserClient } from "@/lib/utils/core-request/browserClient";

export const PerfumeReview = ({ perfumeId }: { perfumeId: string }) => {
  const api = createApiBrowserClient();

  const { data } = useQuery({
    queryKey: ["perfume", perfumeId, "review"],
    queryFn: () =>
      api.get<IReviewsResponse, IReviewItem[]>(
        `/reviews/${perfumeId}`,
        undefined,
        {
          transformResponse: (res) => res.data,
        }
      ),
  });

  return (
    <section className="flex flex-col pc:gap-[60px] pc:w-[760px] pc:px-0">
      <ReviewAnalytics data={data ?? []} />
      <MobileSeparator />
      <ReviewList data={data ?? []} />
    </section>
  );
};
