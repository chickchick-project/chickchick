export const SkeletonBookmark = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="w-full h-24 bg-gray-200 rounded-lg animate-pulse"></div>
      ))}
    </div>
  );
};
