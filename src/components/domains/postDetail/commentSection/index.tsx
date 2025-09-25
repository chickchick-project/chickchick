"use client";
import { CommentResponse } from "@/lib/hono/schemas/comment.schema";
import CommentForm from "./comment/CommentForm";
import CommentIList from "./comment/CommentIList";
import { SearchResponse } from "@/lib/hooks/useInfinityScroll";
import { getCommentsByPostId } from "./comment.helper";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { ApiSuccessResponse } from "@/lib/hono/utils/response.constants";

interface ICommentSectionProps {
  postId: string;
  totalCommentCount: number;
}
export default function CommentSection({
  postId,
  totalCommentCount,
}: ICommentSectionProps) {
  const {
    data: commentResult,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<
    ApiSuccessResponse<SearchResponse<CommentResponse>>,
    Error,
    InfiniteData<ApiSuccessResponse<SearchResponse<CommentResponse>>>,
    string[],
    string | null
  >({
    queryKey: ["post", postId, "comments"],
    queryFn: ({ pageParam }) => getCommentsByPostId(postId, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.nextCursor || undefined;
    },
  });

  const commentList =
    commentResult?.pages.flatMap((page) => page.data.data) || [];

  if (isError) {
    return <div>댓글을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <section className="px-4">
      <h2 className="text-title-2 tablet:text-headline-3 font-semibold text-black-100">
        댓글 {totalCommentCount}
      </h2>
      <CommentForm type="create" postId={postId} />
      {!isLoading && commentList.length > 0 && (
        <CommentIList
          isLoadingComments={isFetchingNextPage}
          hasNextCursor={hasNextPage}
          commentList={commentList}
          onLoadMore={fetchNextPage}
        />
      )}
    </section>
  );
}
