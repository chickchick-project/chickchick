"use client";

import { MyCommentsList } from "../components";
import { useUserComment } from "@/client/hooks/query/useUserQuery";

export default function MyCommentsListLoader() {
  const { data: paginatedComments, error } = useUserComment();

  if (error) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>댓글을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <MyCommentsList comments={paginatedComments?.data || []} />;
}
