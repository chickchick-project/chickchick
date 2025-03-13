// import { BOARD_TYPES, TBoardType } from "@/lib/constants/communityBoard";
import { ChipOutlinedPrimary } from "./ChipOutlined";
import { CATEGORY_LABELS, CategoryType } from "@/lib/constants/post";

interface IBoardChipProps {
  size?: "s" | "m";
  type: CategoryType;
}

export default function BoardChip({ size = "m", type }: IBoardChipProps) {
  const chipSize = size === "s" ? "text-label-2 px-2 py-1" : "text-label-1 px-3 py-2";
  return <ChipOutlinedPrimary className={`${chipSize}`}>{CATEGORY_LABELS[type]}</ChipOutlinedPrimary>;
}
