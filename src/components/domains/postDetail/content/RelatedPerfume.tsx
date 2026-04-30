"use client";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import Link from "next/link";
import type { ApiPerfumeSimpleResponse } from "@/server/hono/schemas/perfume.schema";
interface IRelatedPerfumeProps {
  perfumes: ApiPerfumeSimpleResponse[];
}

export default function RelatedPerfume({ perfumes }: IRelatedPerfumeProps) {
  return (
    <section className="pt-10 tablet:pt-5 pb-10">
      <h2 className="text-title-2 tablet:text-headline-3 font-semibold text-black-100">
        관련된 향수
      </h2>
      <div className="grid tablet:grid-cols-5 grid-cols-3 tablet:gap-x-6 gap-x-4  mobile:gap-y-5 gap-y-4 mt-5">
        {perfumes.map((item: ApiPerfumeSimpleResponse) => (
          <Link key={item.id} href={`/perfumes/${item.id}`}>
            <PerfumeCard
              cardType="default"
              className="tablet:block hidden"
              perfumeImage={item.perfumeImage?.imageUrl ?? null}
              perfumeName={item.nameKo ?? item.nameEn}
              brandName={item.brand.nameKo ?? item.brand.nameEn}
            />
            <PerfumeCard
              className="tablet:hidden block"
              cardType="smallSize"
              perfumeImage={item.perfumeImage?.imageUrl ?? null}
              perfumeName={item.nameKo ?? item.nameEn}
              brandName={item.brand.nameKo ?? item.brand.nameEn}
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
