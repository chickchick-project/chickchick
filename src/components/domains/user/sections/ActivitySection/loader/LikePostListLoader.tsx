"use client";

import { LikePostList } from "../components";
import { useUserLikedPost } from "../hooks/useUserActivity";

export default function LikePostListLoader() {
  const { data: likedPosts, error } = useUserLikedPost();

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>좋아요한 글을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <LikePostList likedPosts={likedPosts || []} />;
}
