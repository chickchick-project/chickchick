"use client";

import { MyCommentsList } from "../components";
import { useUserComment } from "../hooks/useUserActivity";
import { MyComment } from "@/lib/hono/services/me.service";

export default function MyCommentsListLoader({
  initialData,
}: {
  initialData?: MyComment[];
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
