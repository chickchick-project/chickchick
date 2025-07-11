import { MainBanner } from "@/components/domains/main/mainBanner/MainBanner";
import { MainContent } from "@/components/domains/main/mainContent/MainContent";
import { MainLogo } from "@/components/domains/main/MainLogo";
import { MainSearchBar } from "@/components/domains/main/MainSearchBar";
import { getPerfumesListService } from "@/lib/hono/services/perfume.service";
import { PerfumeResponse } from "@/lib/hono/schemas/perfume.schema";

// TODO: 배너에 보여줄 테마에 맞는 필터 적용 필요
export default async function Home() {
  const data: PerfumeResponse[] = await getPerfumesListService();

  return (
    <>
      <MainLogo />
      <MainBanner data={data} />
      <MainSearchBar />
      <MainContent />
    </>
  );
}
