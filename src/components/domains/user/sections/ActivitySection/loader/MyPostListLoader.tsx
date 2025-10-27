"use client";

import { MyPostList } from "../components";
import { useUserPost } from "@/lib/hooks/query/useUserQuery";

export default function MyPostListLoader() {
  const { data: paginatedPosts, error } = useUserPost();

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>게시글을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <MyPostList posts={paginatedPosts?.data || []} />;
}
