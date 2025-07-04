"use client";

import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import { ReviewBarSection } from "./ReviewBarSection";
import { ReviewDoughnutSection } from "./ReviewDoughnutSection";
import { SectionTitle } from "@/components/commons/sectionTitle";
import { useState } from "react";
import { ReviewModal } from "@/components/modal/reviewModal/ReviewModal";

export const ReviewAnalytics = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  return (
    <section className="flex flex-col gap-4 tablet:gap-5 w-full">
      <SectionTitle>리뷰 한눈에 보기</SectionTitle>
      <section className="hidden tablet:flex flex-col gap-5">
        <ReviewDoughnutSection />
        <ReviewBarSection />
      </section>
      <section className="tablet:hidden"></section>
      <section className="hidden tablet:block w-60 self-center">
        <div className="text-gray-100 text-label-2 font-medium text-center pb-2">
          주현님의 소중한 의견을 나눠주세요!
        </div>
        <ButtonFilledPrimaryLFull onClick={() => setIsModalOpen(true)}>
          리뷰 작성하기
        </ButtonFilledPrimaryLFull>
      </section>
      {isModalOpen && <ReviewModal closeModal={() => setIsModalOpen(false)} />}
    </section>
  );
};
