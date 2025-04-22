import { Headline2Semibold } from "@/components/commons/text/Headline2Semibold";
import { Perfume } from "@/app/api/search/route";
import { MainBannerPerfumeList } from "./MainBannerPerfumeList";

interface IBannerProps {
  data?: Perfume[];
}

export const MainBanner = ({ data }: IBannerProps) => {
  return (
    <section className="flex flex-col items-center justify-center px-10 py-9 bg-gray-300 w-full">
      <div className="flex flex-col justify-center items-start gap-5 w-full pc:w-[1200px]">
        <Headline2Semibold>추운 겨울에 어울리는 향수 TOP 5</Headline2Semibold>
        {data && <MainBannerPerfumeList data={data} />}
      </div>
    </section>
  );
};
