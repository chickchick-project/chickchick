import { BOARD_TYPES, TBoardType } from "@/lib/constants/communityBoard";
import { ChipOutlinedPrimary } from "./chipOutlined";

interface IBoardChipProps {
  size: "s" | "m";
  type: TBoardType;
}

export default function BoardChip({ size, type }: IBoardChipProps) {
  const chipSize = size === "s" ? "text-label-2 px-2 py-1" : "text-label-1 px-3 py-2";
  return <ChipOutlinedPrimary className={`${chipSize}`}>{BOARD_TYPES[type]}</ChipOutlinedPrimary>;
}
