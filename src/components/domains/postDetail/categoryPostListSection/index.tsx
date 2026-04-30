"use client";

import {
  ApiPostDetailCategoryPostResponse,
  ApiPostDetailResponse,
} from "@/server/hono/schemas/community.schema";
import { useState } from "react";
import dynamic from "next/dynamic";
import CategoryPostListHeader from "./Header";
import CategoryPostList from "./CategoryPostList";
import PostListPagination from "./PostListPagination";

const PostListMobileSwiper = dynamic(() => import("./PostListMobileSwiper"), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse">
      <div className="h-[200px] bg-gray-200 rounded" />
    </div>
  ),
});

interface ICommunityListItem {
  category: ApiPostDetailResponse["category"];
  postId: string;
  posts: ApiPostDetailCategoryPostResponse[] | [];
}

const ITEMS_PER_PAGE = 5;

export default function CategoryPostListSection({
  category,
  postId,
  posts,
}: ICommunityListItem) {
  const currentPostId = postId;
  const postList = posts;
  const [currentPage, setCurrentPage] = useState(1);

  const totalItemsCount = postList.length;
  const totalPages = Math.ceil(totalItemsCount / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const desktopItems = postList.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section className="w-full mt-8 px-4 pc:px-0">
      <CategoryPostListHeader category={category} />

      <div className="block tablet:hidden">
        <PostListMobileSwiper posts={postList} currentPostId={currentPostId} />
      </div>

      {/* 타블렛, 데스크탑: 현재 페이지에 해당하는 5개만 보여줌 */}
      <div className="hidden tablet:block">
        <CategoryPostList posts={desktopItems} currentPostId={currentPostId} />
        <PostListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}
