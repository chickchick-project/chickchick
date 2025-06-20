import { MainContentButtons } from "./MainContentButton/MainContentButtons";
import { MainContentButtonsSwiper } from "./MainContentButton/MainContentButtonsSwiper";
import { MainContentReview } from "./MainContentReview";
import { MainContentCommunity } from "./mainContentCommunity/MainContentCommunity";

export const MainContent = () => {
  return (
    <section className="w-full flex items-center justify-center">
      <div className="pc:max-w-[1200px] w-full h-fit flex pc:flex-row flex-col items-start justify-center gap-8 pb-10">
        <div className="pc:flex hidden h-full flex-col gap-5">
          <MainContentButtons />
          <MainContentReview />
        </div>
        <div className="pc:hidden flex flex-col items-center justify-center gap-10">
          <MainContentButtonsSwiper />
          <MainContentReview />
        </div>
        <MainContentCommunity />
      </div>
    </section>
  );
};
