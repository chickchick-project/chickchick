"use client";

import dynamic from "next/dynamic";
import PostContent from "./content";
import PostDetailHeader from "./header";
import { useLogRecentItem } from "@/client/stores/perfumeStore";
import { useRecentPostsStore } from "@/client/stores/perfumeStore";
import {
  PageSkeleton,
  CategoryPostListSectionSkeleton,
  CommentSectionSkeleton,
} from "./skeleton";
import {
  useCommunityPost,
  useCommunityPostCategoryPosts,
  useCommunityPostStatus,
} from "@/client/hooks/query/useCommunityQuery";

const CommentSection = dynamic(() => import("./commentSection"), {
  ssr: false,
  loading: () => <CommentSectionSkeleton />,
});

const CategoryPostListSection = dynamic(
  () => import("./categoryPostListSection"),
  {
    ssr: false,
    loading: () => <CategoryPostListSectionSkeleton />,
  },
);

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
  useLogRecentItem(postDetail, useRecentPostsStore);
  if (isPostDetailPending || isPostStatusPending || isCategoryPostsPending) {
    return <PageSkeleton />;
  }
  if (isPostDetailError || isPostStatusError || isCategoryPostsError) {
    return <div>{error?.message}</div>;
  }

  if (!postDetail || !postStatus) {
    return <div>게시글을 찾을 수 없습니다.</div>; // 디자인 필요
  }

  const { content, ...postDetailHeader } = postDetail;

  return (
    <main className="min-h-screen">
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
    </main>
  );
}
