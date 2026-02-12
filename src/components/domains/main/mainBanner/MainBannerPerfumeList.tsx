import PerfumeCard from "@/components/commons/card/perfumeCard";
import Link from "next/link";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

interface IMainBannerPerfumesListProps {
  data: ApiPerfumeSimpleResponse[];
}

export const MainBannerPerfumeList = ({
  data,
}: IMainBannerPerfumesListProps) => {
  return (
    <div className="overflow-auto w-full">
      <ul className="flex gap-5 justify-between w-full px-5 tablet:py-5 py-4">
        {data.map((item, index) => (
          <li key={item.id}>
            <Link href={`/perfumes/${item.id}`}>
              <PerfumeCard
                className="tablet:block hidden tablet:w-[180px] w-auto"
                cardType="default"
                perfumeImage={item.perfumeImage?.imageUrl || null}
                brandName={item.brand.nameKo || item.brand.nameEn || null}
                perfumeName={item.nameKo || item.nameEn || null}
                priority={index === 0}
              />
              <PerfumeCard
                className="tablet:hidden block w-[80px]"
                cardType="smallSize"
                perfumeImage={item.perfumeImage?.imageUrl || null}
                brandName={item.brand.nameKo || item.brand.nameEn || null}
                perfumeName={item.nameKo || item.nameEn || null}
                priority={index === 0}
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
