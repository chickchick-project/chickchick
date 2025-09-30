"use client";

import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";
import { MyCommentsList } from "../components";
import { useUserComment } from "../hooks/useUserActivity";

export default function MyCommentsListLoader({
  initialData,
}: {
  initialData?: PostCardProps[];
}) {
  const { data: comments, error } = useUserComment(initialData);

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>댓글을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <MyCommentsList comments={comments || []} />;
}
