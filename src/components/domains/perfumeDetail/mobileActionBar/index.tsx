import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import {
  Interactions,
  INTERACTION_TYPES,
} from "@/components/commons/interactions";
import { BookmarkIcon } from "@/components/commons/interactions/icons/BookmarkIcon";
import { LikeIcon } from "@/components/commons/interactions/icons/LikeIcon";
import { ShareIcon } from "@/components/commons/interactions/icons/ShareIcon";
import { InteractionStates } from "../overview/perfumeInfo";

interface MobileActionBarProps {
  interactionStates: InteractionStates;
  onToggleInteraction: (type: keyof InteractionStates) => void;
}

export const MobileActionBar = ({
  interactionStates,
  onToggleInteraction,
}: MobileActionBarProps) => {
  return (
    <div className="w-full flex items-center gap-4 px-5 py-[10px] bg-white shadow-card">
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
      <ButtonFilledPrimaryLFull>리뷰 작성하기</ButtonFilledPrimaryLFull>
    </div>
  );
};
