import { useQuery } from "@tanstack/react-query";
import { reviewApi } from "../../utils/api/reviews.api";
import { queryKeys } from "../../utils/queryKeys";

// 특정 향수의 리뷰 목록 조회
export const usePerfumeReviews = (perfumeId: string) => {
  return useQuery({
    queryKey: queryKeys.perfume.reviews(perfumeId),
    queryFn: async () => {
      const res = await reviewApi.list(perfumeId);
      return res?.data || [];
    },
    enabled: !!perfumeId,
  });
};

// 인기 리뷰 목록 조회
export const usePopularReviews = () => {
  return useQuery({
    queryKey: queryKeys.review.popular(),
    queryFn: () => reviewApi.popular(),
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};
