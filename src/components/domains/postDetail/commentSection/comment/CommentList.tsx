"use client";

import { useState } from "react";

import ArrowIcon from "@/components/commons/icons/arrowIcon";
import { ButtonFilledGrayLFixed } from "@/components/commons/button/ButtonFilled";

import { CommentActionState, CommentListProps } from "./postComment.types";
import CommentListItem from "./CommentListItem";

export default function CommentList({
  commentList,
  onLoadMore,
  hasNextCursor,
  isLoadingComments,
  postAuthorId,
}: CommentListProps) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(
    null
  );

  const commentActionState: CommentActionState = {
    editingCommentId,
    setEditingCommentId,
    replyingCommentId,
    setReplyingCommentId,
  };

  return (
    <section className="flex flex-col items-center">
      <ul className="flex flex-col w-full">
        {commentList.map((comment) => (
          <CommentListItem
            key={comment.id}
            postAuthorId={postAuthorId}
            commentActionState={commentActionState}
            comment={comment}
          />
        ))}
      </ul>
      {hasNextCursor && (
        <ButtonFilledGrayLFixed
          disabled={isLoadingComments}
          onClick={onLoadMore}
          iconTrailing={
            <ArrowIcon color="gray-100" size="16" direction="down" />
          }
          className="w-full tablet:w-[280px] mt-5 h-12"
        >
          {isLoadingComments ? "로딩 중..." : "더보기"}
        </ButtonFilledGrayLFixed>
      )}
    </section>
  );
}
