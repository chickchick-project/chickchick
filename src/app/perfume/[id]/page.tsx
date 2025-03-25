interface PerfumeDetailPageProps {
  params: { id: string };
}

export default function PerfumeDetailPage({ params }: PerfumeDetailPageProps) {
  const { id } = params;

  return (
    <main>
      <h1>향수 상세 페이지</h1>
      <p>향수 ID: {id}</p>
    </main>
  );
}
