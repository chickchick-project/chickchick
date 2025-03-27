import { SearchBar } from "@/components/commons/search/SearchBar";

export default async function PerfumeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;

  return (
    <main>
      <h1>향수 상세 페이지</h1>
      <p>향수 ID: {resolvedParams.id}</p>
      <SearchBar />
    </main>
  );
}
