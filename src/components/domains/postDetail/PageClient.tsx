"use client";

import { SearchResponse } from "@/lib/hooks/useInfinityScroll";
import CommentSection from "./commentSection";
import PostContent from "./content";
import PostDetailHeader from "./header";
import { CommentResponse } from "@/lib/hono/schemas/comment.schema";
import {
  PostDetailResponse,
  PostStatusResponse,
} from "@/lib/hono/schemas/community.schema";
import { useState } from "react";

interface IPostDetailPageClientProps {
  postDetail: PostDetailResponse;
  postStatus: PostStatusResponse;
  initialCommentsResult: SearchResponse<CommentResponse>;
}

export default function PageClient({
  postDetail,
  postStatus,
  initialCommentsResult,
}: IPostDetailPageClientProps) {
  const { content, ...postDetailHeader } = postDetail;

  const [totalCommentCount, setTotalCommentCount] = useState(
    postStatus.commentCount || 0
  );

  const changeCommentCount = (change: 1 | -1) => {
    setTotalCommentCount((prev) => {
      const updated = prev + change;
      return updated < 0 ? 0 : updated;
    });
  };

  return (
    <article>
      <PostDetailHeader
        postStatus={{ ...postStatus, commentCount: totalCommentCount }}
        {...postDetailHeader}
      />
      <PostContent
        postId={postDetail.id}
        content={content}
        isAuthor={postDetail.isAuthor}
        relatedPerfumes={[]}
      />
      <CommentSection
        postId={postDetail.id}
        initialCommentsResult={initialCommentsResult}
        totalCommentCount={totalCommentCount}
        changeCommentCount={changeCommentCount}
      />
    </article>
  );
}
