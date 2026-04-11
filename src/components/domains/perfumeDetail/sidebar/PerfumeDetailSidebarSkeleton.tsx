export const PerfumeDetailSidebarSkeleton = () => {
  return (
    <section className="animate-pulse">
      <div className="h-7 w-48 bg-gray-200 rounded pl-5 pc:pl-0 mb-4 tablet:mb-5" />
      <ul className="pl-5 pc:pl-0 flex gap-4 pb-5 overflow-x-hidden pc:flex-col pc:gap-6 pt-4 tablet:pt-5">
        {[0, 1, 2].map((i) => (
          <li key={i} className="border border-gray-200 rounded-lg p-6 flex flex-col gap-3 shadow-card shrink-0 w-[260px] pc:w-auto">
            {/* 카테고리 칩 */}
            <div className="h-6 w-16 bg-gray-200 rounded-full" />
            {/* 제목 */}
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
            {/* 메타 */}
            <div className="flex gap-3 justify-end">
              {[40, 44, 40].map((w, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded" style={{ width: w }} />
              ))}
            </div>
            {/* 본문 */}
            <div className="flex flex-col gap-1">
              <div className="h-4 w-full bg-gray-200 rounded" />
              <div className="h-4 w-4/5 bg-gray-200 rounded" />
              <div className="h-4 w-3/5 bg-gray-200 rounded" />
            </div>
            {/* 작성자 */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
              <div className="h-4 w-14 bg-gray-200 rounded ml-auto" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
