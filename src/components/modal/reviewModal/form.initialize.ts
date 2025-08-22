"use client";

import { useUserStore } from "@/lib/stores/useUserStore";
import { Review } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export const useInitialize = (method: UseFormReturn<Review>) => {
  const { id } = useParams();
  const perfumeId = id?.toString();

  const { user } = useUserStore();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const onSubmit = async (data: Review): Promise<void> => {
    const payload = { ...data, authorId: user?.id };

    try {
      await fetch(`/api/v1/reviews/${perfumeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error(error);
    } finally {
      window.location.reload();
    }
  };

  useEffect(() => {
    if (!perfumeId) return;
    method.setValue("authorId", user?.id || "", {
      shouldDirty: true,
    });
    method.setValue("perfumeId", perfumeId, {
      shouldDirty: true,
    });
    setIsLoaded(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perfumeId]);

  return {
    onSubmit,
    isLoaded,
  };
};
