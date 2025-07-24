import { MainBanner } from "@/components/domains/main/mainBanner/MainBanner";
import { getBannerData } from "@/components/domains/main/mainBanner/mainBanner.helper";
import { MainContent } from "@/components/domains/main/mainContent/MainContent";
import { MainLogo } from "@/components/domains/main/MainLogo";
import { MainSearchBar } from "@/components/domains/main/MainSearchBar";
import { PerfumeResponse } from "@/lib/hono/schemas/perfume.schema";

export default async function Home() {
  const data: PerfumeResponse[] = await getBannerData("FRESH");

  return (
    <>
      <MainLogo />
      <MainBanner data={data} />
      <MainSearchBar />
      <MainContent />
    </>
  );
}
