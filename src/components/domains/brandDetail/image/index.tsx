"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import { useState } from "react";
import ICONS from "@/shared/constants/icons";

interface IBrandDetailImageProps {
  images: {
    src: string;
    alt: string;
  };
}

export const BrandDetailImage = ({ images }: IBrandDetailImageProps) => {
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  return (
    <div className="relative w-full h-fit">
      <style jsx global>{`
        .swiper-button-next::after,
        .swiper-button-prev::after {
          display: none !important;
        }
      `}</style>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet",
          bulletActiveClass: "swiper-pagination-bullet-active",
        }}
        navigation={{
          nextEl: ".custom-next",
          prevEl: ".custom-prev",
        }}
        modules={[Pagination, Autoplay, Navigation]}
        watchOverflow={false}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onInit={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        <SwiperSlide className="pc:px-0 px-5">
          <Image
            src={images.src}
            alt={images.alt}
            width={1200}
            height={500}
            quality={60}
            placeholder="blur"
            blurDataURL="/images/BlurShimmer.svg"
            className="rounded-xl"
          />
        </SwiperSlide>
      </Swiper>
      <div
        className={`custom-prev absolute tablet:left-4 left-6 top-1/2 -translate-y-1/2 z-10 cursor-pointer transition-opacity ${
          isBeginning && "hidden"
        }`}
      >
        <Image
          src={ICONS.SwiperLeftButton.src}
          alt={ICONS.SwiperLeftButton.alt}
          width={48}
          height={48}
          className="tablet:w-12 tablet:h-12 w-6 h-6 pc:m-0 m-3"
        />
      </div>
      <div
        className={`custom-next absolute tablet:right-4 right-6 top-1/2 -translate-y-1/2 z-10 cursor-pointer transition-opacity ${
          isEnd && "hidden"
        }`}
      >
        <Image
          src={ICONS.SwiperRightButton.src}
          alt={ICONS.SwiperRightButton.alt}
          width={48}
          height={48}
          className="tablet:w-12 tablet:h-12 w-6 h-6 pc:m-0 m-3"
        />
      </div>
    </div>
  );
};
