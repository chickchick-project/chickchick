"use client";

import CommentSection from "./commentSection";
import PostContent from "./content";
import PostDetailHeader from "./header";
import { useLogRecentItem } from "@/lib/stores/useLogRecentItem";
import { useRecentPostsStore } from "@/lib/stores/useRecentPostsStore";
import { Spinner } from "@/components/commons/loading/Spinner";
import CategoryPostListSection from "./categoryPostListSection";
import {
  useCommunityPost,
  useCommunityPostCategoryPosts,
  useCommunityPostStatus,
} from "@/lib/hooks/query/useCommunityQuery";

export default function PageClient({ postId }: { postId: string }) {
  const {
    data: postDetail,
    isPending: isPostDetailPending,
    isError: isPostDetailError,
    error: postDetailError,
  } = useCommunityPost(postId);

  const {
    data: postStatus,
    isPending: isPostStatusPending,
    isError: isPostStatusError,
    error: postStatusError,
  } = useCommunityPostStatus(postId);

  const {
    data: categoryPosts,
    isPending: isCategoryPostsPending,
    isError: isCategoryPostsError,
    error: CategoryPostsError,
  } = useCommunityPostCategoryPosts(postId);

  const error = postDetailError || postStatusError || CategoryPostsError;

  if (isPostDetailPending || isPostStatusPending || isCategoryPostsPending) {
    return <Spinner />;
  }
  if (isPostDetailError || isPostStatusError || isCategoryPostsError) {
    return <div>{error?.message}</div>;
  }

  if (!postDetail || !postStatus) {
    return <div>게시글을 찾을 수 없습니다.</div>; // 디자인 필요
  }

  useLogRecentItem(postDetail, useRecentPostsStore);

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
