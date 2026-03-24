// import { BOARD_TYPES, TBoardType } from "@/shared/constants/communityBoard";
import { ChipOutlinedPrimary } from "./ChipOutlined";
import { CATEGORY_LABELS, CategoryType } from "@/shared/constants/post";

interface IBoardChipProps {
  size?: "s" | "m";
  type: CategoryType;
}

export default function BoardChip({ size = "m", type }: IBoardChipProps) {
  const chipSize =
    size === "s"
      ? "text-label-2 px-2 py-1"
      : "text-label-2 px-2 py-1 tablet:text-label-1 tablet:px-3 tablet:py-2 ";
  return (
    <ChipOutlinedPrimary className={`${chipSize}`}>
      {CATEGORY_LABELS[type]}
    </ChipOutlinedPrimary>
  );
}
