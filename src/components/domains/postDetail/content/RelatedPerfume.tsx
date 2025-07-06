"use client";
import PerfumeCard from "@/components/commons/card/perfumeCard";

type TPerfume = {
  perfume_id: number;
  image_url: string;
  brand_name: string;
  brand_id: number;
  perfume_name: string;
};

interface IRelatedPerfumeProps {
  perfumes: TPerfume[] | [];
}

export default function RelatedPerfume({ perfumes }: IRelatedPerfumeProps) {
  return (
    <section className="pt-10 tablet:pt-5 pb-10">
      <h2 className="text-title-2 tablet:text-headline-3 font-semibold text-black-100">
        관련된 향수
      </h2>
      <div className="flex items-center gap-5 mt-4">
        {perfumes.map((item) => (
          <PerfumeCard
            key={item.perfume_id}
            perfumeImage={item.image_url}
            perfumeName={item.perfume_name}
            brandName={item.brand_name}
          />
        ))}
      </div>
    </section>
  );
}
