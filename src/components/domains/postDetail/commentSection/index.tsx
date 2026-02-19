"use client";

import { useInfiniteComments } from "@/lib/hooks/query/useCommentQuery";

import CommentForm from "./comment/CommentForm";
import CommentList from "./comment/CommentList";
import CommentSkeleton from "../skeleton/CommentSkeleton";

interface CommentSectionProps {
  postId: string;
  postAuthorId: string;
  totalCommentCount: number;
}

export default function CommentSection({
  postId,
  postAuthorId,
  totalCommentCount,
}: CommentSectionProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteComments(postId);

  const commentList =
    data?.pages.flatMap((page) => page?.data?.data ?? []) ?? [];

  if (isError) {
    return (
      <section className="px-4">
        <div className="text-body-1 text-red-500">
          댓글을 불러오는 중 오류가 발생했습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 min-h-[300px]">
      <h2 className="text-title-2 tablet:text-headline-3 font-semibold text-black-100">
        댓글 {totalCommentCount}
      </h2>
      <CommentForm type="create" postId={postId} />
      {isLoading ? (
        <CommentSkeleton />
      ) : (
        commentList.length > 0 && (
          <CommentList
            postAuthorId={postAuthorId}
            isLoadingComments={isFetchingNextPage}
            hasNextCursor={hasNextPage}
            commentList={commentList}
            onLoadMore={fetchNextPage}
          />
        )
      )}
    </section>
  );
}
