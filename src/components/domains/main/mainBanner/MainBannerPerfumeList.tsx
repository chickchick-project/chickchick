import { Perfume } from "@/app/api/search/route";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import Link from "next/link";

interface IMainBannerPerfumesListProps {
  data: Perfume[];
}

export const MainBannerPerfumeList = ({
  data,
}: IMainBannerPerfumesListProps) => {
  return (
    <div className="flex w-full justify-between">
      {data.map((item) => (
        <Link key={item.perfume_id} href={`/perfumes/${item.perfume_id}`}>
          <PerfumeCard
            perfumeImage={item.image_url}
            brandName={item.brand_name.en}
            perfumeName={item.perfume_name.en}
          />
        </Link>
      ))}
    </div>
  );
};
