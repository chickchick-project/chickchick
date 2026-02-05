import { MainContentButtons } from "./MainContentButton/MainContentButtons";
import { MainContentReview } from "./MainContentReview";
import { MainContentCommunity } from "./mainContentCommunity/MainContentCommunity";

export const MainContent = () => {
  return (
    <section className="w-full flex items-center justify-center">
      <div className="pc:max-w-[1200px] w-full h-fit flex pc:flex-row flex-col items-start justify-center gap-8 pb-10">
        <div className="w-full pc:w-auto flex flex-col gap-5 pc:gap-5">
          <MainContentButtons />
          <MainContentReview />
        </div>
        <MainContentCommunity />
      </div>
    </section>
  );
};
