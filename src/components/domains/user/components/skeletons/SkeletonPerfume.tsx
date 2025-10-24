export const SkeletonPerfume = () => {
  return (
    <div className="grid grid-cols-3 gap-x-2 gap-y-4 tablet:grid-cols-5 tablet:gap-x-4 tablet:gap-y-8">
      {[...Array(15)].map((_, index) => (
        <div key={index} aria-hidden="true">
          <div className="aspect-square rounded-xl bg-gray-200 animate-pulse" />

          <div className="w-full tablet:mt-2 mt-1 tablet:space-y-1 space-y-0.5">
            <div className="h-4 w-3/4 rounded bg-gray-200 animate-pulse" />
            <div className="h-5 w-full rounded bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};
