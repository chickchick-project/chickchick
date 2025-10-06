export const SkeletonCard = () => {
  return (
    <div className="grid grid-cols-2 gap-5">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="w-[540px] h-[220px] bg-gray-200 rounded-lg animate-pulse"
          aria-hidden="true"
        ></div>
      ))}
    </div>
  );
};
