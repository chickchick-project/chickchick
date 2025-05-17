"use client";

import PerfumeCard from "@/components/commons/card/perfumeCard";

export const PerfumeRecentViewList = () => {
  const mockPerfumes = [
    {
      id: "1",
      perfumeImage: "https://i.ibb.co/TR0HqY4/image.jpg",
      brandName: "브랜드 A",
      perfumeName: "향수 A",
    },
    {
      id: "2",
      perfumeImage: "https://i.ibb.co/TR0HqY4/image.jpg",
      brandName: "브랜드 B",
      perfumeName: "향수 B",
    },
    {
      id: "3",
      perfumeImage: "https://i.ibb.co/TR0HqY4/image.jpg",
      brandName: "브랜드 C",
      perfumeName: "향수 C",
    },
    {
      id: "4",
      perfumeImage: "https://i.ibb.co/TR0HqY4/image.jpg",
      brandName: "브랜드 D",
      perfumeName: "향수 D",
    },
  ];

  return (
    <section>
      <h2 className="pl-5 pc:pl-0 text-black-100 font-semibold text-title-2 tablet:text-headline-2 mb-5">
        최근 본 향수
      </h2>
      <ul className="pl-5 pc:pl-0 flex pc:justify-between gap-4 overflow-x-auto scrollbar-hide pr-5 pc:pr-0">
        {mockPerfumes.map((perfume) => (
          <li key={perfume.id}>
            <PerfumeCard
              cardType="default"
              perfumeImage={perfume.perfumeImage}
              brandName={perfume.brandName}
              perfumeName={perfume.perfumeName}
              onClick={() => alert("향수 상세페이로 이동")}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};
