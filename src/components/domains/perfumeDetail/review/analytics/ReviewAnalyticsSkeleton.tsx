export const ReviewAnalyticsSkeleton = () => {
  return (
    <div className="flex flex-col gap-5 animate-pulse">
      {/* 도넛 차트 영역 — 실제: <section className="w-full p-9 rounded-xl shadow-card"> */}
      <section className="hidden tablet:block w-full p-9 rounded-xl shadow-card">
        <ul className="grid grid-cols-[max-content_1fr] gap-x-9 gap-y-9 w-full">
          {[0, 1, 2, 3].map((i) => (
            <li key={i} className="flex gap-7 items-center">
              {/* 도넛 — 실제: w-[120px] h-[120px] */}
              <div className="relative w-[120px] h-[120px] shrink-0">
                <div className="absolute inset-0 border-[14px] border-gray-200 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-4 bg-gray-200 rounded" />
              </div>
              {/* 범례 — 실제: flex-col gap-1, 5개 항목 */}
              <ul className="flex flex-col gap-1">
                {[0, 1, 2, 3, 4].map((j) => (
                  <li key={j} className="flex items-center gap-2">
                    <div className="w-[9px] h-[9px] rounded-full bg-gray-200 shrink-0" />
                    <div className="w-14 h-3 bg-gray-200 rounded" />
                    <div className="w-5 h-3 bg-gray-200 rounded" />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      {/* 바 차트 영역 — 실제: <section className="w-full p-9 pb-5 rounded-xl shadow-card">, 3개 항목 */}
      <section className="hidden tablet:block w-full p-9 pb-5 rounded-xl shadow-card">
        <ul className="grid grid-cols-2 gap-x-9 gap-y-5 w-full">
          {[0, 1, 2].map((i) => (
            <li key={i} className="flex flex-col items-center gap-1">
              {/* 타이틀 — 실제: text-body-1 font-semibold */}
              <div className="h-5 w-12 bg-gray-200 rounded" />
              {/* 차트 — 실제: height={120} */}
              <div className="w-full h-[120px] bg-gray-200 rounded" />
            </li>
          ))}
        </ul>
      </section>

      {/* 모바일 영역 — 실제: 7개 아코디언, gap-[18px] px-4 */}
      <section className="tablet:hidden">
        <ul className="flex flex-col gap-[18px] px-4">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <li key={i} className="rounded-xl">
              {/* 버튼 행 — 실제: border badge + 텍스트 + dashed line + 숫자 + caret */}
              <div className="flex items-center gap-3">
                <div className="w-[61px] h-9 bg-gray-200 rounded-md shrink-0" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="flex-1 h-px bg-gray-200" />
                <div className="h-4 w-6 bg-gray-200 rounded" />
              </div>
              {/* 바 차트 — 기본 open 상태 */}
              <div className="mt-4 flex flex-col gap-3 px-2">
                {[0, 1, 2].map((j) => (
                  <div key={j} className="flex gap-3 items-center">
                    <div className="w-[79px] h-3 bg-gray-200 rounded shrink-0" />
                    <div className="h-2 flex-1 bg-gray-200 rounded-full" />
                    <div className="w-[31px] h-3 bg-gray-200 rounded" />
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
