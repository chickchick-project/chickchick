"use client";

import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { MainContentButton } from "./MainContentButton";
import { MAIN_BUTTONS } from "@/shared/constants/main";

export const MainContentButtonSwiper = () => {
  return (
    <div className="relative w-full tablet:px-5 px-4 min-h-[140px] tablet:min-h-[200px]">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        watchOverflow={false}
        resistanceRatio={0.85}
      >
        {MAIN_BUTTONS.map((button, index) => {
          const titleLines = button.title.split("\n");
          return (
            <SwiperSlide key={index}>
              <MainContentButton
                link={button.link}
                title={
                  <>
                    {titleLines.map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < titleLines.length - 1 && <br />}
                      </span>
                    ))}
                  </>
                }
                linkText={button.linkText}
                bgImage={button.bgImage}
                isPriority={index === 0}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};
