import { Headline2Semibold } from "@/components/commons/text/Headline2Semibold";
import { MainContentCommunityList } from "./MainContentCommunityList";

export const MainContentCommunity = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-5">
      <Headline2Semibold>커뮤니티 인기글</Headline2Semibold>
      <MainContentCommunityList size="m" />
    </div>
  );
};
