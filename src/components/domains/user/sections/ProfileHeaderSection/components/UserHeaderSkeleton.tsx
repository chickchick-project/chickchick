const UserHeaderSkeleton = () => (
  <header className="ml-10 mb-16 flex items-center gap-4">
    <div className="flex items-center gap-5">
      <div className="w-[140px] h-[140px] bg-gray-200 animate-pulse rounded-full" />
      <div className="flex flex-col my-[7px] gap-1">
        <div className="w-16 h-6 bg-gray-200 animate-pulse rounded" />
        <div className="w-32 h-8 bg-gray-200 animate-pulse rounded" />
        <div className="flex gap-x-5">
          <div className="w-20 h-5 bg-gray-200 animate-pulse rounded" />
          <div className="w-20 h-5 bg-gray-200 animate-pulse rounded" />
          <div className="w-20 h-5 bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
    </div>
  </header>
);

export default UserHeaderSkeleton;
