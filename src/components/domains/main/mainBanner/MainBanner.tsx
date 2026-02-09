import { MainBannerPerfumeList } from "./MainBannerPerfumeList";
import { getPerfumesListByThemeService } from "@/lib/hono/services/perfume.service";
import { unstable_cache } from "next/cache";

const getCachedPerfumes = unstable_cache(
  async () => {
    const result = await getPerfumesListByThemeService("mostLike");
    return result.success ? result.data : [];
  },
  ["main-banner-perfumes"],
  {
    revalidate: 3600, // 1시간 캐시
    tags: ["perfumes", "main-banner"],
  }
);

export const MainBanner = async () => {
  const data = await getCachedPerfumes();

  return (
    <section className="flex flex-col items-center justify-center tablet:px-10 px-5 tablet:py-9 py-5 bg-gray-300 w-full">
      <div className="flex flex-col justify-center items-start w-full pc:w-[1200px]">
        <h2 className="tablet:text-headline-2 text-title-2 font-semibold text-black-100">
          현재 가장 인기가 많은 향수 TOP 5
        </h2>
        <MainBannerPerfumeList data={data} />
      </div>
    </section>
  );
};
