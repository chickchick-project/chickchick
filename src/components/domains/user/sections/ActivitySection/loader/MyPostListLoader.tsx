"use client";

import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";
import { MyPostList } from "../components";
import { useUserPost } from "../hooks/useUserActivity";

export default function MyPostListLoader({
  initialData,
}: {
  initialData?: PostCardProps[];
}) {
  const { data: posts, error } = useUserPost(initialData);

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>게시글을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <MyPostList posts={posts || []} />;
}
