"use client";

import { ButtonFilledGrayLFixed } from "@/components/commons/button/ButtonFilled";
import CommentListItem from "./CommentListItem";
import { ICommentIListProps, TCommentActionState } from "./postComment.types";
import { useState } from "react";
import ArrowIcon from "@/components/commons/icons/arrowIcon";

export default function CommentList({
  commentList,
  onLoadMore,
  onAction,
  nextCursor,
  isLoadingComments,
}: ICommentIListProps) {
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(
    null
  );

  const commentActionState: TCommentActionState = {
    editingCommentId,
    setEditingCommentId,
    replyingCommentId,
    setReplyingCommentId,
  };
  return (
    <section className="flex flex-col items-center">
      <ul className="flex flex-col w-full">
        {commentList.length > 0 &&
          commentList.map((comment) => (
            <CommentListItem
              key={comment.id}
              commentActionState={commentActionState}
              comment={comment}
              onAction={onAction}
            />
          ))}
      </ul>
      {nextCursor && (
        <ButtonFilledGrayLFixed
          disabled={isLoadingComments || !nextCursor}
          onClick={onLoadMore}
          iconTrailing={
            <ArrowIcon color="gray-100" size="16" direction="down" />
          }
          className="w-full tablet:w-[280px] mt-5 h-12"
        >
          더보기
        </ButtonFilledGrayLFixed>
      )}
    </section>
  );
}
