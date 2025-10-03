import { MainBanner } from "@/components/domains/main/mainBanner/MainBanner";
import { MainContent } from "@/components/domains/main/mainContent/MainContent";
import { MainLogo } from "@/components/domains/main/MainLogo";
import { MainSearchBar } from "@/components/domains/main/MainSearchBar";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";
import { getBannerData } from "@/components/domains/main/mainBanner/mainBanner.helper";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data: ApiPerfumeSimpleResponse[] = await getBannerData("FRESH");
  return (
    <>
      <MainLogo />
      <MainBanner data={data} />
      <MainSearchBar />
      <MainContent />
    </>
  );
}
