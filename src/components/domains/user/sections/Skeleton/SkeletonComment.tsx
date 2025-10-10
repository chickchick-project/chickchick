export const SkeletonComment = () => {
  return (
    <div>
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={`p-4`} aria-hidden="true">
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
  );
};
