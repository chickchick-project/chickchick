"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import { SectionTitle } from "@/components/commons/sectionTitle";
import { ReviewModal } from "@/components/modal/reviewModal";
import { useUserStore } from "@/client/stores/useUserStore";
import { calculateReviewCounts } from "./analytics.helpers";
import { ReviewAnalyticsProps } from "../review.type";

const ReviewBarSection = dynamic(
  () =>
    import("./ReviewBarSection").then((mod) => ({ default: mod.ReviewBarSection })),
  { ssr: false }
);

const ReviewDoughnutSection = dynamic(
  () =>
    import("./ReviewDoughnutSection").then((mod) => ({
      default: mod.ReviewDoughnutSection,
    })),
  { ssr: false }
);

const ReviewMobileSection = dynamic(() => import("./ReviewMobileSection"), {
  ssr: false,
});
// TODO: 리뷰 수정 기능 검토
export const ReviewAnalytics = ({ data }: ReviewAnalyticsProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { user } = useUserStore();
  const isReviewed = data.some((review) => review.author.id === user?.id);
  const counts = useMemo(() => calculateReviewCounts(data), [data]);

  return (
    <section className="flex flex-col gap-4 tablet:gap-5 w-full">
      <SectionTitle>리뷰 한눈에 보기</SectionTitle>
      <section className="hidden tablet:flex flex-col gap-5">
        <ReviewDoughnutSection counts={counts} />
        <ReviewBarSection counts={counts} />
      </section>
      <section className="tablet:hidden">
        <ReviewMobileSection counts={counts} />
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
