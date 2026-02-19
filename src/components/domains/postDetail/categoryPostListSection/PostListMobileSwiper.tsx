"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import CategoryPostList from "./CategoryPostList";
import { Pagination } from "swiper/modules";
import type { ApiPostDetailCategoryPostResponse } from "@/lib/hono/schemas/community.schema";

interface IPostListMobileSwiperProps {
  posts: ApiPostDetailCategoryPostResponse[] | [];
  currentPostId: string;
}

const ITEMS_PER_PAGE = 5;
export default function PostListMobileSwiper({
  posts,
  currentPostId,
}: IPostListMobileSwiperProps) {
  const swiperPages = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < posts.length; i += ITEMS_PER_PAGE) {
      chunks.push(posts.slice(i, i + ITEMS_PER_PAGE));
    }
    return chunks;
  }, [posts]);

  if (posts.length === 0) {
    return <CategoryPostList posts={[]} currentPostId={currentPostId} />;
  }

  return (
    <Swiper
      modules={[Pagination]}
      spaceBetween={20}
      slidesPerView={1}
      autoHeight={true}
      pagination={{ clickable: true }}
      watchOverflow={false}
      className={`
        !overflow-visible
        [&_.swiper-pagination]:!top-[-35px]
        [&_.swiper-pagination]:!right-3
        [&_.swiper-pagination]:!left-auto
        [&_.swiper-pagination]:!w-auto
        [&_.swiper-pagination]:!bottom-auto
        [&_.swiper-pagination-bullet]:bg-primary-300
      `}
    >
      {swiperPages.map((pageItems, index) => (
        <SwiperSlide key={index}>
          <CategoryPostList posts={pageItems} currentPostId={currentPostId} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
