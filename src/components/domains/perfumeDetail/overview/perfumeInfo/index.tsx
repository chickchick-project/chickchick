"use client";

import { TPerfumeDetail } from "@/lib/types/perfumeDetail";
import { PerfumeInfoHeader } from "./header";
import { PerfumeInfoMainAccord } from "./mainAccords";
import { PerfumeInfoNote } from "./notes";
import { ButtonOutlinedPrimaryLFull } from "@/components/commons/button/ButtonOutlined";
import Image from "next/image";
import ICONS from "@/lib/constants/icons";

export type InteractionStates = {
  liked: boolean;
  bookmarked: boolean;
};

interface PerfumeInfoProps {
  perfumeInfo: Omit<TPerfumeDetail, "imageUrl">;
  interactionStates: InteractionStates;
  onToggleInteraction: (type: keyof InteractionStates) => void;
}

export const PerfumeInfo = ({
  perfumeInfo,
  interactionStates,
  onToggleInteraction,
}: PerfumeInfoProps) => {
  const { name, brand, officialUrl, accords, notes } = perfumeInfo;
  const isAccordAvailable = accords.length !== 0;
  const isNoteAvailable = notes.length !== 0;

  return (
    <section className="w-full flex flex-col justify-between gap-10 tablet:gap-5">
      <div className="flex flex-col gap-10 tablet:gap-5 justify-between">
        <PerfumeInfoHeader
          perfumeName={name}
          brandName={brand}
          interactionStates={interactionStates}
          onToggleInteraction={onToggleInteraction}
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
