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
import CategoryPostListSection from "./categoryPostListSection";
import { useCommunityPostCategoryPosts } from "@/lib/hooks/query/useCommunityQuery";

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

  const {
    data: categoryPosts,
    isPending: isCategoryPostsPending,
    isError: isCategoryPostsError,
    error: CategoryPostsError,
  } = useCommunityPostCategoryPosts(postId);

  useLogRecentItem(postDetail, useRecentPostsStore);
  const error = postDetailError || postStatusError || CategoryPostsError;
  if (isPostDetailPending || isPostStatusPending || isCategoryPostsPending) {
    return <Spinner />;
  }
  if (isPostDetailError || isPostStatusError || isCategoryPostsError) {
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
      <div className="divider-horizontal-thick block tablet:hidden mb-10" />
      <CommentSection
        postId={postId}
        postAuthorId={postDetail.author.id}
        totalCommentCount={postStatus.commentCount}
      />
      <div className="divider-horizontal-thick block tablet:hidden mt-10" />
      {categoryPosts && categoryPosts.length > 0 && (
        <CategoryPostListSection
          category={postDetail.category}
          postId={postId}
          posts={categoryPosts}
        />
      )}
      <div className="divider-horizontal-thick block tablet:hidden mt-1" />
    </article>
  );
}
