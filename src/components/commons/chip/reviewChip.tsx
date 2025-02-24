import { ChipFilledGray } from "./chipFilled";

interface IReviewChipProps {
  label?: string;
  count?: number;
}

//리뷰 라벨 constant로 정리 후 label 수정 필요
export default function ReviewChip({ label, count }: IReviewChipProps) {
  const displayText = label || (count ? `+${count}` : "");
  return (
    <ChipFilledGray className="text-label-5 px-[6px] py-1 h-5 tablet:text-label-1 tablet:px-3 tablet:py-2 tablet:h-8">
      {displayText}
    </ChipFilledGray>
  );
}
