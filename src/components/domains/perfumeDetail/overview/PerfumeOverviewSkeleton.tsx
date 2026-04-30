export const PerfumeOverviewSkeleton = () => {
  return (
    <section className="w-full flex flex-col gap-10 tablet:grid tablet:grid-cols-[minmax(0,400px)_1fr] animate-pulse">
      {/* 이미지 */}
      <div className="w-full aspect-square bg-gray-200 rounded-xl" />

      {/* PerfumeInfo */}
      <section className="w-full flex flex-col justify-between gap-10 tablet:gap-5">
        <div className="flex flex-col gap-10 tablet:gap-5">
          {/* Header: 브랜드명 + 향수명 + 인터랙션 */}
          <header className="flex justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-48 bg-gray-200 rounded" />
            </div>
            <div className="hidden tablet:flex gap-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
              <div className="h-10 w-10 bg-gray-200 rounded-full" />
            </div>
          </header>

          {/* 메인 어코드 */}
          <section>
            <div className="h-5 w-20 bg-gray-200 rounded mb-3" />
            <div className="flex gap-2 flex-wrap">
              {[72, 56, 88, 64].map((w, i) => (
                <div key={i} className="h-8 bg-gray-200 rounded-full" style={{ width: w }} />
              ))}
            </div>
          </section>

          {/* 노트 */}
          <section>
            <div className="h-5 w-12 bg-gray-200 rounded mb-3" />
            <div className="flex gap-3">
              {[40, 52, 44, 60].map((w, i) => (
                <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: w }} />
              ))}
            </div>
          </section>
        </div>

        {/* 공식 사이트 버튼 */}
        <div className="self-end w-full tablet:w-[130px] h-11 bg-gray-200 rounded-lg" />
      </section>
    </section>
  );
};
