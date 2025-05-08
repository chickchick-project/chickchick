"use client";

import { TPerfumeDetail } from "@/lib/types/perfumeDetail";
import { PerfumeInfoHeader } from "./header";
import { useState } from "react";
import { PerfumeInfoMainAccord } from "./mainAccords";
import { PerfumeInfoNote } from "./notes";
import { ButtonOutlinedPrimaryLFull } from "@/components/commons/button/ButtonOutlined";
import Image from "next/image";
import ICONS from "@/lib/constants/icons";

export type InteractionStates = {
  liked: boolean;
  bookmarked: boolean;
};

export const PerfumeInfo = ({
  perfumeInfo,
}: {
  perfumeInfo: Omit<TPerfumeDetail, "imageUrl">;
}) => {
  const { name, brand, officialUrl, accords, notes } = perfumeInfo;
  const isAccordAvailable = accords.length !== 0;
  const isNoteAvailable = notes.length !== 0;

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
    <section className="w-full flex flex-col justify-between gap-10 tablet:gap-5">
      <div className="flex flex-col gap-10 tablet:gap-5 justify-between">
        <PerfumeInfoHeader
          perfumeName={name}
          brandName={brand}
          interactionStates={interactionStates}
          onToggleInteraction={toggleInteraction}
        />
        {isAccordAvailable && <PerfumeInfoMainAccord accords={accords} />}
        {isNoteAvailable && <PerfumeInfoNote notes={notes} />}
      </div>
      {officialUrl && (
        <div className="self-end w-full tablet:w-[130px]">
          <ButtonOutlinedPrimaryLFull
            iconLeading={
              <Image {...ICONS.GlobePrimary} width={20} height={20} />
            }
            onClick={() =>
              window.open(officialUrl, "_blank", "noopener,noreferrer")
            }
          >
            공식 사이트
          </ButtonOutlinedPrimaryLFull>
        </div>
      )}
    </section>
  );
};
