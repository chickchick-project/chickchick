export default function CategoryPostListSection() {
  return (
    <section className="w-full mt-8 px-4 pc:px-0">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center mb-3">
        <div className="h-7 tablet:h-8 w-32 tablet:w-40 rounded bg-gray-200 animate-pulse" />
        <div className="hidden tablet:block h-5 w-16 rounded bg-gray-200 animate-pulse" />
      </div>

      {/* Mobile Swiper Skeleton */}
      <div className="block tablet:hidden mb-4">
        <div className="h-[200px] bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Desktop List Skeleton */}
      <div className="hidden tablet:block divide-y divide-gray-200/50">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="relative w-full py-2 px-2 grid grid-cols-[1fr_160px_100px] items-center animate-pulse"
          >
            <div className="flex items-baseline min-w-0 gap-2">
              <div className="h-5 w-3/4 rounded bg-gray-200" />
              <div className="h-5 w-12 rounded bg-gray-200" />
            </div>
            <div className="pl-7">
              <div className="h-5 w-20 rounded bg-gray-200" />
            </div>
            <div className="pl-5 flex justify-center">
              <div className="h-5 w-16 rounded bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
