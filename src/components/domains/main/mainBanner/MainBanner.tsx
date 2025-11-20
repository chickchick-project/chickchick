import { MainBannerPerfumeList } from "./MainBannerPerfumeList";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

interface IBannerProps {
  data: ApiPerfumeSimpleResponse[];
}

export const MainBanner = ({ data }: IBannerProps) => {
  return (
    <section className="flex flex-col items-center justify-center tablet:px-10 px-5 tablet:py-9 py-5 bg-gray-300 w-full">
      <div className="flex flex-col justify-center items-start w-full pc:w-[1200px]">
        <div className="tablet:text-headline-2 text-title-2 font-semibold text-black-100">
          현재 가장 인기가 많은 향수 TOP 5
        </div>
        {data && <MainBannerPerfumeList data={data} />}
      </div>
    </section>
  );
};
