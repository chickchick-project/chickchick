"use client";

import CommentSection from "./commentSection";
import PostContent from "./content";
import PostDetailHeader from "./header";
import { useQuery } from "@tanstack/react-query";
import {
  getPostDetailById,
  getPostDetailStatusById,
} from "./postDetail.helpers";

export default function PageClient({ postId }: { postId: string }) {
  const { data: postDetail } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostDetailById(postId),
    staleTime: 1000 * 60 * 5,
  });

  const { data: postStatus } = useQuery({
    queryKey: ["post", postId, "status"],
    queryFn: () => getPostDetailStatusById(postId),
  });

  if (!postDetail || !postStatus) {
    return <div>Loading...</div>;
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
