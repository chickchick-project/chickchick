import { MainBanner } from "@/components/domains/main/mainBanner/MainBanner";
import { MainContent } from "@/components/domains/main/mainContent/MainContent";
import { MainLogo } from "@/components/domains/main/MainLogo";
import { MainSearchBar } from "@/components/domains/main/MainSearchBar";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <h1 className="sr-only">ChickChick - 나만의 향수 컬렉션</h1>
      <MainLogo />
      <MainBanner />
      <MainSearchBar />
      <MainContent />
    </>
  );
}
