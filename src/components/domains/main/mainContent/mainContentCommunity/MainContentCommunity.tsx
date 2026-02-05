import { MainContentCommunityList } from "./MainContentCommunityList";
import { getPaginatedPostListService } from "@/lib/hono/services/community.service";

export const MainContentCommunity = async () => {
  const result = await getPaginatedPostListService({
    sortBy: "popular",
    limit: 8,
  });

  const initialData = result.success ? result.data.data : [];

  return (
    <div className="flex flex-col items-start justify-center gap-5 w-full pc:px-0 px-4">
      <div className="tablet:text-headline-2 text-title-2 font-semibold text-black-100">
        커뮤니티 인기글
      </div>
      <MainContentCommunityList size="m" initialData={initialData} />
    </div>
  );
};
