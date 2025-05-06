"use client";
import PerfumeCard from "@/components/commons/card/perfumeCard";

const relatedPerfumes = [
  {
    id: 1,
    perfumeImage:
      "https://wvedpvxspndgyoisudyr.supabase.co/storage/v1/object/public/perfume_image/perfumes/375x500.31172.jpg",
    brandName: "Chanel",
    perfumeName: "Chanel No. 5",
  },
  {
    id: 2,
    perfumeImage:
      "https://wvedpvxspndgyoisudyr.supabase.co/storage/v1/object/public/perfume_image/perfumes/375x500.31172.jpg",
    brandName: "Dior",
    perfumeName: "Dior Sauvage",
  },
  {
    id: 3,
    perfumeImage:
      "https://wvedpvxspndgyoisudyr.supabase.co/storage/v1/object/public/perfume_image/perfumes/375x500.31172.jpg",
    brandName: "Gucci",
    perfumeName: "Gucci Bloom",
  },
];

export default function RelatedPerfume() {
  return (
    <section className="pt-10 tablet:pt-5 pb-10">
      <h2 className="text-headline-3 font-semibold text-black-100">
        관련된 향수
      </h2>
      <div className="flex items-center gap-5 mt-4">
        {relatedPerfumes.map((item) => (
          <PerfumeCard
            key={item.id}
            perfumeImage={item.perfumeImage}
            perfumeName={item.perfumeName}
            brandName={item.brandName}
          />
        ))}
      </div>
    </section>
  );
}
