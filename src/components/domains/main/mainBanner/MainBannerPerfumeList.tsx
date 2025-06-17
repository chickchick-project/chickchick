"use client";

import PerfumeCard from "@/components/commons/card/perfumeCard";
import Link from "next/link";

interface IMainBannerPerfumesListProps {
  data: {
    id: string;
    imageUrl: string | null;
    brand: {
      id: string;
      nameKo: string | null;
      nameEn: string;
    };
    nameKo: string | null;
    nameEn: string;
  }[];
}

export const MainBannerPerfumeList = ({
  data,
}: IMainBannerPerfumesListProps) => {
  return (
    <>
      <style jsx global>{`
        @keyframes left-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-40vw);
          } /* 이동 거리 조정 */
        }
        .animate-left-right {
          animation: left-right 10s linear infinite alternate;
        }
      `}</style>

      <div className="flex gap-5 w-full justify-between animate-left-right px-0.5">
        {data.map((item) => (
          <Link key={item.id} href={`/perfumes/${item.id}`}>
            <PerfumeCard
              cardType="smallSize"
              perfumeImage={item.imageUrl || null}
              brandName={item.brand.nameKo || item.brand.nameEn || null}
              perfumeName={item.nameKo || item.nameEn || null}
            />
          </Link>
        ))}
      </div>
    </>
  );
};
