"use client";

import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import { ReviewBarSection } from "./ReviewBarSection";
import { ReviewDoughnutSection } from "./ReviewDoughnutSection";
import { SectionTitle } from "@/components/commons/sectionTitle";
import { useState } from "react";
import { ReviewModal } from "@/components/modal/reviewModal/ReviewModal";
// import ReviewMobileSection from "./ReviewMobileSection";
import { ReviewResponse } from "@/lib/hono/schemas/review.schema";
import { useUserStore } from "@/lib/stores/useUserStore";
import ReviewMobileSection from "./ReviewMobileSection";

// TODO: 리뷰 수정 기능 검토
export const ReviewAnalytics = ({ data }: { data: ReviewResponse[] }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { user } = useUserStore();
  const isReviewed = data.some((review) => review.author.id === user?.id);

  console.log("ReviewAnalytics data", data);
  return (
    <section className="flex flex-col gap-4 tablet:gap-5 w-full">
      <SectionTitle>리뷰 한눈에 보기</SectionTitle>
      <section className="hidden tablet:flex flex-col gap-5">
        <ReviewDoughnutSection data={data} />
        <ReviewBarSection data={data} />
      </section>
      <section className="tablet:hidden">
        <ReviewMobileSection data={data} />
      </section>
      <section className="hidden tablet:block w-60 self-center">
        <div className="text-gray-100 text-label-2 font-medium text-center pb-2">
          {user?.nickname}님의 소중한 의견을 나눠주세요!
        </div>
        {
          <ButtonFilledPrimaryLFull
            disabled={isReviewed}
            onClick={() => setIsModalOpen(true)}
          >
            {isReviewed ? "이미 리뷰를 작성했습니다." : "리뷰 작성하기"}
          </ButtonFilledPrimaryLFull>
        }
      </section>
      {isModalOpen && <ReviewModal closeModal={() => setIsModalOpen(false)} />}
    </section>
  );
};
