import { MainContentButtons } from "./MainContentButton";
import { MainContentReview } from "./MainContentReview";
import { MainContentCommunity } from "./mainContentCommunity/MainContentCommunity";

export const MainContent = () => {
  return (
    <section className="h-fit flex items-start justify-center gap-8 px-4 pb-10">
      <div className="w-fit h-full flex flex-col gap-5">
        <MainContentButtons />
        <MainContentReview />
      </div>
      <MainContentCommunity />
    </section>
  );
};
