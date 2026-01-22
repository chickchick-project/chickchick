export const SkeletonBanner = () => {
  return (
    <div className="overflow-auto w-full">
      <div className="flex gap-5 justify-between w-full px-5 tablet:py-5 py-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <div key={index}>
            {/* 태블릿 이상 크기 스켈레톤 */}
            <div className="tablet:block hidden tablet:w-[180px] w-auto">
              <div className="flex flex-col gap-2">
                <div className="w-full h-[180px] bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2" />
              </div>
            </div>
            {/* 모바일 크기 스켈레톤 */}
            <div className="tablet:hidden block w-[80px] mobile:w-auto">
              <div className="flex flex-col gap-1">
                <div className="w-[80px] mobile:w-[120px] h-[120px] mobile:h-[160px] bg-gray-200 animate-pulse rounded-lg" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-1/2" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
