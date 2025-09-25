/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { Spinner } from "@/components/commons/loading/Spinner";
import PerfumeCard from "@/components/commons/card/perfumeCard";

interface PerfumeSectionProps {
  perfumes: any;
  isLoading: boolean;
  isIdle: boolean;
  moreRef: React.RefObject<HTMLDivElement>;
  isFetchingNextPage?: boolean; // 다음 페이지 로딩 상태를 위한 prop 추가
  pageType?: "brandDetail" | "perfumes";
}

export function PerfumeSection({
  perfumes,
  isLoading,
  isIdle,
  moreRef,
  isFetchingNextPage = false,
  pageType = "perfumes",
}: PerfumeSectionProps) {
  const showNoResults = isIdle && !isLoading;
  const showSpinner = isLoading || isFetchingNextPage;
  return (
    <section className="flex flex-col h-full">
      {pageType === "perfumes" && (
        <h3 className="tablet:text-headline-3 text-body-2 font-semibold">
          향수
        </h3>
      )}

      {showNoResults ? (
        <div className="flex justify-center items-center flex-1">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="grid pc:grid-cols-5 tablet:grid-cols-4 mobile:grid-cols-3 grid-cols-2 pc:gap-x-[52px] mobile:gap-x-[24px] gap-x-[10px] mobile:gap-y-10 gap-y-5 mt-5">
          {perfumes.map((item: any, index: number) => {
            return renderPerfumeCard(item, index);
          })}
        </div>
      )}

      {/* 로딩 및 더 보기 표시 */}
      <div ref={moreRef} className="py-10 text-center h-20 min-h-1">
        {showSpinner && (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        )}
      </div>
    </section>
  );
}

const renderPerfumeCard = (item: any, index: number) => {
  return (
    <Link key={item.id || index} href={`/perfumes/${item.id}`} passHref>
      <PerfumeCard
        className="tablet:block hidden"
        perfumeImage={item.perfumeImage?.imageUrl ?? "/images/BlurShimmer.svg"}
        brandName={item.brand?.nameKo ?? item.brand?.nameEn ?? "브랜드 미정"}
        perfumeName={item.nameKo ?? item.nameEn ?? "이름 미정"}
      />
      <PerfumeCard
        className="tablet:hidden block"
        cardType="smallSize"
        perfumeImage={item.perfumeImage?.imageUrl ?? "/images/BlurShimmer.svg"}
        brandName={item.brand?.nameKo ?? item.brand?.nameEn ?? "브랜드 미정"}
        perfumeName={item.nameKo ?? item.nameEn ?? "이름 미정"}
      />
    </Link>
  );
};
