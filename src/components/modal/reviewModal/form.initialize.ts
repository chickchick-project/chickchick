"use client";

// import { createReviewService } from "@/lib/services/review.service";
import { createReview } from "@/lib/queries/reviewQueries";
import { useUserStore } from "@/lib/stores/useUserStore";
import { Review } from "@prisma-zod/index";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export const useInitialize = (method: UseFormReturn<Review>) => {
  const { id } = useParams();
  const perfumeId = id?.toString();

  const { user } = useUserStore();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const onSubmit = async (data: Review): Promise<void> => {
    try {
      // TODO: hono 세팅 완료 후 적용
      // await createReviewService(data);
      await createReview(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!perfumeId) return;

    method.setValue("title", `${perfumeId} 리뷰`);
    method.setValue("authorId", user?.id || "");
    method.setValue("perfumeId", perfumeId);
    method.setValue("usageStatus", "NOT_USED_YET");

    setIsLoaded(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfumeId]);

  return {
    onSubmit,
    isLoaded,
  };
};
