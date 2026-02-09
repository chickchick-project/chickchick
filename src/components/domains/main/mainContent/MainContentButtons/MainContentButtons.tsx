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
            isPriority={index === 0}
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
