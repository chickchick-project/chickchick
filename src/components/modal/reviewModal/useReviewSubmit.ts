"use client";

import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "@/client/utils/api/reviews.api";
import { queryKeys } from "@/client/utils/queryKeys";
import type { CreateReviewClientInput } from "./reviewSchema.client";

export const useReviewSubmit = (closeModal?: () => void) => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const perfumeId = id?.toString();

  const onSubmit = async (data: CreateReviewClientInput): Promise<void> => {
    if (!perfumeId) return;

    try {
      await reviewApi.create(perfumeId, data);

      // 리뷰 쿼리 무효화 (자동으로 리프레시됨)
      await queryClient.invalidateQueries({
        queryKey: queryKeys.perfume.reviews(perfumeId),
      });

      // 사용자의 리뷰 목록도 무효화 (마이페이지에서 보일 수 있음)
      await queryClient.invalidateQueries({
        queryKey: queryKeys.user.reviews("me"),
      });

      // 모달 닫기
      closeModal?.();
    } catch (error) {
      console.error(error);
    }
  };

  return {
    onSubmit,
  };
};
