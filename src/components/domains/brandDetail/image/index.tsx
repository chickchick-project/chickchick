"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";
import ICONS from "@/lib/constants/icons";

interface IBrandDetailImageProps {
  images: {
    order: number;
    src: string;
    alt: string;
  }[];
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
        .swiper-pagination-bullet {
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #dbc0b0;
          width: 8px;
          height: 4px;
          border-radius: 10px;
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
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onInit={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
      >
        {images.map((image) => (
          <SwiperSlide key={image.order} className="pc:px-0 px-5">
            <Image
              src={image.src}
              alt={image.alt}
              width={1000}
              height={400}
              quality={100}
              placeholder="blur"
              blurDataURL="/images/BlurShimmer.svg"
              className="rounded-xl w-full h-fit"
            />
          </SwiperSlide>
        ))}
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
