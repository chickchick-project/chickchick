import { MainContentButtons } from "./MainContentButton/MainContentButtons";
import { MainContentButtonsSwiper } from "./MainContentButton/MainContentButtonsSwiper";
import { MainContentReview } from "./MainContentReview";
import { MainContentCommunity } from "./mainContentCommunity/MainContentCommunity";

export const MainContent = () => {
  return (
    <section className="w-full flex items-center justify-center">
      <div className="tablet:max-w-[1200px] h-fit flex tablet:flex-row flex-col items-start justify-center gap-8 px-4 pb-10">
        <div className="tablet:flex hidden h-full flex-col gap-5">
          <MainContentButtons />
          <MainContentReview />
        </div>
        <div className="tablet:hidden flex flex-col gap-10">
          <MainContentButtonsSwiper />
          <MainContentReview />
        </div>
        <MainContentCommunity />
      </div>
    </section>
  );
};
