"use client";

import { LikePostList } from "../components";
import { useUserLikedPost } from "../hooks/useUserActivity";
import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";

export default function LikePostListLoader({
  initialData,
}: {
  initialData?: PostCardProps[];
}) {
  const { data: likedPosts, error } = useUserLikedPost(initialData);

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>좋아요한 글을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <LikePostList likedPosts={likedPosts || []} />;
}
