import { PerfumeCardType } from "./MainBanner.types";
import { MainBannerPerfumeList } from "./MainBannerPerfumeList";

interface IBannerProps {
  data: PerfumeCardType[];
}

export const MainBanner = ({ data }: IBannerProps) => {
  return (
    <section className="flex flex-col items-center justify-center tablet:px-10 px-5 tablet:py-9 py-5 bg-gray-300 w-full">
      <div className="flex flex-col justify-center items-start w-full pc:w-[1200px]">
        <div className="tablet:text-headline-2 text-title-2 font-semibold text-black-100">
          추운 겨울에 어울리는 향수 TOP 5
        </div>
        {data && <MainBannerPerfumeList data={data} />}
      </div>
    </section>
  );
};
