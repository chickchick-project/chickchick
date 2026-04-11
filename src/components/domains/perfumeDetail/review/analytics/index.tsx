"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import { SectionTitle } from "@/components/commons/sectionTitle";
import { ReviewModal } from "@/components/modal/reviewModal";
import { calculateReviewCounts } from "./analytics.helpers";
import { ReviewAnalyticsProps } from "../review.type";
import { useCurrentUser } from "@/components/commons/Provider/CurrentUserProvider";

const ReviewBarSection = dynamic(
  () =>
    import("./ReviewBarSection").then((mod) => ({
      default: mod.ReviewBarSection,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="w-full p-9 pb-5 rounded-xl shadow-card animate-pulse">
        <ul className="grid grid-cols-2 gap-x-9 gap-y-5 w-full">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex flex-col items-center gap-1">
              <div className="h-5 w-12 bg-gray-200 rounded" />
              <div className="w-full h-[120px] bg-gray-200 rounded" />
            </li>
          ))}
        </ul>
      </section>
    ),
  },
);

const ReviewDoughnutSection = dynamic(
  () =>
    import("./ReviewDoughnutSection").then((mod) => ({
      default: mod.ReviewDoughnutSection,
    })),
  {
    ssr: false,
    loading: () => (
      <section className="w-full p-9 rounded-xl shadow-card animate-pulse">
        <ul className="grid grid-cols-[max-content_1fr] gap-x-9 gap-y-9 w-full">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="flex gap-7 items-center">
              <div className="relative w-[120px] h-[120px] shrink-0">
                <div className="absolute inset-0 border-[14px] border-gray-200 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-4 bg-gray-200 rounded" />
              </div>
              <ul className="flex flex-col gap-1">
                {[0, 1, 2, 3, 4].map((j) => (
                  <li key={j} className="flex items-center gap-2">
                    <div className="w-[9px] h-[9px] rounded-full bg-gray-200 shrink-0" />
                    <div className="w-14 h-3 bg-gray-200 rounded" />
                    <div className="w-5 h-3 bg-gray-200 rounded" />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    ),
  },
);

const ReviewMobileSection = dynamic(() => import("./ReviewMobileSection"), {
  ssr: false,
  loading: () => (
    <section className="animate-pulse">
      <ul className="flex flex-col gap-[18px] px-4">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <li key={i} className="rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-[61px] h-9 bg-gray-200 rounded-md shrink-0" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="flex-1 h-px bg-gray-200" />
              <div className="h-4 w-6 bg-gray-200 rounded" />
            </div>
            <div className="mt-4 flex flex-col gap-3 px-2">
              {[0, 1, 2].map((j) => (
                <div key={j} className="flex gap-3 items-center">
                  <div className="w-[79px] h-3 bg-gray-200 rounded shrink-0" />
                  <div className="h-2 flex-1 bg-gray-200 rounded-full" />
                  <div className="w-[31px] h-3 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  ),
});
// TODO: 리뷰 수정 기능 검토
export const ReviewAnalytics = ({ data }: ReviewAnalyticsProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { user } = useCurrentUser();
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
        <div className="text-black-300 text-label-2 font-medium text-center pb-2">
          {user ? `${user?.nickname}님의 소중한 의견을 나눠주세요!` : ""}
        </div>
        <ButtonFilledPrimaryLFull
          disabled={isReviewed}
          onClick={() => {
            if (!user) {
              alert("로그인 후 리뷰 작성이 가능합니다.");
              return;
            }
            setIsModalOpen(true);
          }}
        >
          {isReviewed ? "이미 리뷰를 작성했습니다." : "리뷰 작성하기"}
        </ButtonFilledPrimaryLFull>
      </section>
      {isModalOpen && <ReviewModal closeModal={() => setIsModalOpen(false)} />}
    </section>
  );
};
