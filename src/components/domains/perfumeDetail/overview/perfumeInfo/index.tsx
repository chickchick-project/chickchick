"use client";

import { TPerfumeDetail } from "@/lib/types/perfumeDetail";
import { PerfumeInfoHeader } from "./header";
import { useState } from "react";

export type InteractionStates = {
  liked: boolean;
  bookmarked: boolean;
};

export const PerfumeInfo = ({
  perfumeInfo,
}: {
  perfumeInfo: Omit<TPerfumeDetail, "imageUrl">;
}) => {
  const { name, brand } = perfumeInfo;

  const [interactionStates, setInteractionStates] = useState<InteractionStates>(
    {
      liked: false,
      bookmarked: false,
    }
  );

  const toggleInteraction = (type: keyof InteractionStates) => {
    setInteractionStates((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  return (
    <>
      <PerfumeInfoHeader
        perfumeName={name}
        brandName={brand}
        interactionStates={interactionStates}
        onToggleInteraction={toggleInteraction}
      />
    </>
  );
};
