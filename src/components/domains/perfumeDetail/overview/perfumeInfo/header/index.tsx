"use client";

import {
  INTERACTION_TYPES,
  Interactions,
} from "@/components/commons/interactions";
import { BookmarkIcon } from "@/components/commons/interactions/icons/BookmarkIcon";
import { LikeIcon } from "@/components/commons/interactions/icons/LikeIcon";
import { ShareIcon } from "@/components/commons/interactions/icons/ShareIcon";
import ICONS from "@/lib/constants/icons";
import Image from "next/image";
import Link from "next/link";
import { InteractionStates } from "..";

interface PerfumeInfoHeaderProps {
  brandName: string;
  perfumeName: string;
  interactionStates: InteractionStates;
  onToggleInteraction: (type: keyof InteractionStates) => void;
}

// temp: 브랜드 페이지 url도 프롭으로 받아야함
export const PerfumeInfoHeader = ({
  brandName,
  perfumeName,
  interactionStates,
  onToggleInteraction,
}: PerfumeInfoHeaderProps) => {
  return (
    <header className="flex justify-between">
      <div className="flex flex-col gap-1">
        <Link href="#" className="flex items-center gap-1">
          <span className="text-label-1 tablet:text-body-2 font-medium text-black-200">
            {brandName}
          </span>
          <Image {...ICONS.ArrowRightGray} width={12} height={12} />
        </Link>
        <h1 className="text-headline-3 tablet:text-headline-2 font-semibold text-black-100">
          {perfumeName}
        </h1>
      </div>
      <div className="hidden tablet:block">
        <Interactions
          items={[
            {
              type: INTERACTION_TYPES.LIKE,
              isActive: interactionStates.liked,
              icon: <LikeIcon />,
              onClick: () => onToggleInteraction("liked"),
              label: "좋아요",
            },
            {
              type: INTERACTION_TYPES.BOOKMARK,
              isActive: interactionStates.bookmarked,
              icon: <BookmarkIcon />,
              onClick: () => onToggleInteraction("bookmarked"),
              label: "북마크",
            },
            {
              type: INTERACTION_TYPES.SHARE,
              icon: <ShareIcon />,
              onClick: () => alert("공유!"),
              label: "공유",
            },
          ]}
        />
      </div>
    </header>
  );
};
