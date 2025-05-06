"use client";

import { ButtonOutlinedPrimaryLFit } from "@/components/commons/button/ButtonOutlined";
import ArrowIcon from "@/components/commons/icons/arrowIcon";

export default function PostNavigation() {
  const handlePrevPostClick = () => {};
  const handleNextPostClick = () => {};
  return (
    <div className="flex justify-center gap-[30px] mb-[60px]">
      <ButtonOutlinedPrimaryLFit
        onClick={handlePrevPostClick}
        iconGap="gap-2"
        iconLeading={
          <ArrowIcon color="primary-100" direction="left" size="18" />
        }
      >
        이전 글
      </ButtonOutlinedPrimaryLFit>
      <ButtonOutlinedPrimaryLFit
        onClick={handleNextPostClick}
        iconGap="gap-2"
        iconTrailing={
          <ArrowIcon color="primary-100" direction="right" size="18" />
        }
      >
        다음 글
      </ButtonOutlinedPrimaryLFit>
    </div>
  );
}
