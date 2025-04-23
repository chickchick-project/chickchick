import { MainBanner } from "@/components/domains/main/mainBanner/MainBanner";
import { MainContent } from "@/components/domains/main/mainContent/MainContent";
import { MainLogo } from "@/components/domains/main/MainLogo";
import { MainSearchBar } from "@/components/domains/main/MainSearchBar";
import { fetchPerfumesWithBanner } from "@/lib/supabase/query/perfumes";

export default async function Home() {
  const data = await fetchPerfumesWithBanner(1, 5);

  return (
    <>
      <MainLogo />
      <MainBanner data={data} />
      <MainSearchBar />
      <MainContent />
    </>
  );
}
