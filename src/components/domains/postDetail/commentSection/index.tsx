"use client";
import { CommentResponse } from "@/lib/hono/schemas/comment.schema";
import CommentForm from "./comment/CommentForm";
import CommentIList from "./comment/CommentIList";

import { useRouter } from "next/navigation";

interface ICommentSectionProps {
  postId: string;
  comments: CommentResponse[] | [];
  totalCommentCount: number;
}
export default function CommentSection({
  postId,
  comments,
  totalCommentCount,
}: ICommentSectionProps) {
  const router = useRouter();
  return (
    <section className="px-4">
      <h2 className="text-title-2 tablet:text-headline-2 font-semibold text-black-100">
        댓글 {totalCommentCount}
      </h2>
      <CommentForm
        type="create"
        postId={postId}
        onSuccess={() => router.refresh()} // 댓글 커서 추가하면 수정 예정.
      />
      {comments.length > 0 && <CommentIList commentList={comments} />}
    </section>
  );
}
