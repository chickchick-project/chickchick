import React from "react";
import Link from "next/link";
import { Perfume } from "@/app/api/search/route";
import { Spinner } from "@/components/commons/loading/Spinner";
import PerfumeCard from "@/components/commons/card/perfumeCard";

interface PerfumeSectionProps {
  perfumes: Perfume[];
  isLoading: boolean;
  isIdle: boolean;
  moreRef: React.RefObject<HTMLDivElement>;
  pageType?: "brandDetail" | "perfumes";
}

export function PerfumeSection({
  perfumes,
  isLoading,
  isIdle,
  moreRef,
  pageType = "perfumes",
}: PerfumeSectionProps) {
  return (
    <section className="flex flex-col h-full">
      {pageType === "perfumes" && (
        <h3 className="tablet:text-headline-3 text-body-2 font-semibold">
          향수
        </h3>
      )}

      {!isIdle && perfumes.length === 0 && !isLoading ? (
        <div className="flex justify-center items-center flex-1">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="grid pc:grid-cols-5 tablet:grid-cols-4 mobile:grid-cols-3 grid-cols-2 pc:gap-x-[52px] mobile:gap-x-[24px] gap-x-[10px] mobile:gap-y-10 gap-y-5 mt-5">
          {perfumes.map((item) => (
            <Link key={item.perfume_id} href={`/perfumes/${item.perfume_id}`}>
              <PerfumeCard
                className="tablet:block hidden"
                perfumeImage={item.image_url ?? "/images/BlurShimmer.svg"}
                brandName={item.brand_name_ko ?? item.brand_name_en}
                perfumeName={item.perfume_name_ko ?? item.perfume_name_en}
              />
              <PerfumeCard
                className="tablet:hidden block"
                cardType="smallSize"
                perfumeImage={item.image_url ?? "/images/BlurShimmer.svg"}
                brandName={item.brand_name_ko ?? item.brand_name_en}
                perfumeName={item.perfume_name_ko ?? item.perfume_name_en}
              />
            </Link>
          ))}
        </div>
      )}

      {/* 로딩 및 더 보기 표시 */}
      <div ref={moreRef} className="py-10 text-center">
        {isLoading && (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        )}
      </div>
    </section>
  );
}
