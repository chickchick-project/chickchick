export const ReviewListSkeleton = () => {
  return (
    <ul className="flex flex-col tablet:gap-6 tablet:px-5 pc:px-0 animate-pulse">
      {[1, 2, 3].map((i) => (
        <li key={i} className="flex flex-col gap-3 py-5 border-b border-gray-200 tablet:border-0">
          {/* 프로필 + 작성자 */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="h-4 w-20 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded ml-auto" />
          </div>
          {/* 태그 */}
          <div className="flex gap-2">
            {[48, 64, 56].map((w, j) => (
              <div key={j} className="h-6 bg-gray-200 rounded-full" style={{ width: w }} />
            ))}
          </div>
          {/* 본문 */}
          <div className="flex flex-col gap-1">
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-3/4 bg-gray-200 rounded" />
          </div>
        </li>
      ))}
    </ul>
  );
};
