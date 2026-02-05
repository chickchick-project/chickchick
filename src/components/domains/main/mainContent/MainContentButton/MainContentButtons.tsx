"use client";

import { MainContentButton } from "./MainContentButton";
import { MAIN_BUTTONS } from "./MainContentButton.constants";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./MainContentButtonsSwiper.styles.css";

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

      {/* Mobile: Swiper */}
      <div className="pc:hidden block relative w-full tablet:px-5 px-4">
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
    </>
  );
};
