"use client";

import { MainContentButton } from "./MainContentButton";
import IMAGES from "@/lib/constants/images";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./MainContentButtonsSwiper.styles.css";

// TODO: pagination bullet 스타일 수정 필요
export const MainContentButtonsSwiper = () => {
  return (
    <div className="relative w-[96vw]">
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        modules={[Pagination, Autoplay, Navigation]}
        pagination={{
          clickable: true,
          // el: ".custom-swiper-pagination",
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
      >
        <SwiperSlide>
          <MainContentButton
            link="/perfumes"
            title={
              <>
                원하는 향수를
                <br />
                찾아보세요!
              </>
            }
            linkText="향수 검색페이지로 이동하기 ->"
            bgImage={IMAGES.MainButton1.src.src}
          />
        </SwiperSlide>
        <SwiperSlide>
          <MainContentButton
            link="/community"
            title={
              <>
                내가 좋아하는 향을
                <br />
                추천해보세요!
              </>
            }
            linkText="커뮤니티 페이지로 이동하기 ->"
            bgImage={IMAGES.MainButton2.src.src}
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
