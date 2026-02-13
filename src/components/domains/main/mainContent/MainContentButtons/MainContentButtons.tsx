"use client";

import dynamic from "next/dynamic";
import { MainContentButton } from "./MainContentButton";
import { MAIN_BUTTONS } from "@/lib/constants/main";

const MainContentButtonSwiper = dynamic(
  () =>
    import("./MainContentButtonsSwiper").then(
      (mod) => mod.MainContentButtonSwiper,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="pc:hidden block">
        <MainContentButton
          link={MAIN_BUTTONS[0].link}
          title={MAIN_BUTTONS[0].title}
          linkText={MAIN_BUTTONS[0].linkText}
          bgImage={MAIN_BUTTONS[0].bgImage}
        />
      </div>
    ),
  },
);

export const MainContentButtons = () => {
  return (
    <>
      {/* Desktop/Tablet: Grid Layout */}
      <div className="pc:flex hidden gap-7">
        {MAIN_BUTTONS.map((button, index) => (
          <MainContentButton
            key={index}
            link={button.link}
            title={button.title}
            linkText={button.linkText}
            bgImage={button.bgImage}
          />
        ))}
      </div>

      {/* Mobile: Swiper - Lazy Loaded */}
      <div className="pc:hidden block">
        <MainContentButtonSwiper />
      </div>
    </>
  );
};
