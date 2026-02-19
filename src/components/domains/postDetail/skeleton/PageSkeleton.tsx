export default function PageSkeleton() {
  return (
    <article>
      {/* Header Skeleton */}
      <header className="mobile:mt-10 pc:mt-[60px] px-4">
        <div className="flex item-center justify-between">
          {/* BoardChip Skeleton */}
          <div className="h-8 w-20 rounded bg-gray-200 animate-pulse" />
          {/* PostInteractions Skeleton */}
          <div className="flex gap-2">
            <div className="h-6 w-6 rounded bg-gray-200 animate-pulse" />
            <div className="h-6 w-6 rounded bg-gray-200 animate-pulse" />
            <div className="h-6 w-6 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
        {/* Title Skeleton */}
        <div className="mt-5 mb-4 tablet:mb-5 h-8 tablet:h-10 w-3/4 rounded bg-gray-200 animate-pulse" />
        {/* Author Info Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-7 w-7 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-20 rounded bg-gray-200 animate-pulse" />
            <div className="w-px h-3 bg-gray-200" />
            <div className="h-4 w-24 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
        <div className="divider-horizontal mt-4 tablet:mt-5 mb-10" />
      </header>

      {/* Content Skeleton */}
      <section>
        <div className="px-4">
          <div className="min-h-[400px] space-y-3">
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-10/12 rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-full rounded bg-gray-200 animate-pulse" />
            <div className="h-4 w-9/12 rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      </section>

      <div className="divider-horizontal-thick block tablet:hidden mb-10" />

      {/* Comment Section Skeleton */}
      <section className="px-4 min-h-[300px]">
        <div className="h-6 tablet:h-8 w-24 rounded bg-gray-200 animate-pulse mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="p-4 border-b border-gray-100">
              <div className="flex flex-col items-start gap-2 animate-pulse">
                <div className="h-6 w-11/12 rounded bg-gray-200" />
                <div className="flex justify-between w-full mt-1">
                  <div className="flex gap-5 items-center">
                    <div className="h-4 w-24 rounded bg-gray-200" />
                    <div className="h-4 w-40 rounded bg-gray-200" />
                  </div>
                  <div className="h-4 w-20 rounded bg-gray-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
