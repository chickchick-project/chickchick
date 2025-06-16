import { MainContentCommunityList } from "./MainContentCommunityList";

export const MainContentCommunity = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-5 w-full">
      <div className="tablet:text-headline-2 text-title-2 font-semibold text-black-100">
        커뮤니티 인기글
      </div>
      <MainContentCommunityList size="m" />
    </div>
  );
};
