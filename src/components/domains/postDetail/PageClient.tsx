"use client";

import CommentSection from "./commentSection";
import PostContent from "./content";
import PostDetailHeader from "./header";
import { useQuery } from "@tanstack/react-query";
import {
  getPostDetailById,
  getPostDetailStatusById,
} from "./postDetail.helpers";
import { useLogRecentItem } from "@/lib/stores/useLogRecentItem";
import { useRecentPostsStore } from "@/lib/stores/useRecentPostsStore";
import { Spinner } from "@/components/commons/loading/Spinner";

export default function PageClient({ postId }: { postId: string }) {
  const {
    data: postDetail,
    isPending: isPostDetailPending,
    isError: isPostDetailError,
    error: postDetailError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostDetailById(postId),
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: postStatus,
    isPending: isPostStatusPending,
    isError: isPostStatusError,
    error: postStatusError,
  } = useQuery({
    queryKey: ["post", postId, "status"],
    queryFn: () => getPostDetailStatusById(postId),
  });

  useLogRecentItem(postDetail, useRecentPostsStore);
  const error = postDetailError || postStatusError;
  if (isPostDetailPending || isPostStatusPending) {
    return <Spinner />;
  }
  if (isPostDetailError || isPostStatusError) {
    return <div>{error?.message}</div>;
  }
  const { content, ...postDetailHeader } = postDetail;

  return (
    <article>
      <PostDetailHeader postStatus={postStatus} {...postDetailHeader} />
      <PostContent
        postId={postId}
        content={content}
        isAuthor={postDetail.isAuthor}
        relatedPerfumes={postDetail.perfumes}
      />
      <CommentSection
        postId={postId}
        postAuthorId={postDetail.author.id}
        totalCommentCount={postStatus.commentCount}
      />
    </article>
  );
}
