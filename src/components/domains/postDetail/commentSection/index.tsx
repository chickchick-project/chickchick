"use client";
import { CommentResponse } from "@/lib/hono/schemas/comment.schema";
import CommentForm from "./comment/CommentForm";
import CommentIList from "./comment/CommentIList";
import { SearchResponse } from "@/lib/hooks/useInfinityScroll";
import { useReducer, useState } from "react";
import { getCommentsByPostId } from "./comment.helper";
import {
  ADD_NEW_COMMENT,
  ADD_NEW_REPLY,
  CommentAction,
  commentsReducer,
  DELETE_COMMENT,
} from "./comment.reducer";

interface ICommentSectionProps {
  postId: string;
  initialCommentsResult: SearchResponse<CommentResponse>;
  totalCommentCount: number;
  changeCommentCount: (change: 1 | -1) => void;
}
export default function CommentSection({
  postId,
  initialCommentsResult,
  changeCommentCount,
  totalCommentCount,
}: ICommentSectionProps) {
  const [commentList, dispatch] = useReducer(
    commentsReducer,
    initialCommentsResult.data || []
  );

  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [nextCursor, setNextCursor] = useState(
    initialCommentsResult.nextCursor
  );

  const handleLoadMoreComments = async () => {
    if (isLoadingComments || !nextCursor) return;
    setIsLoadingComments(true);
    try {
      const response = await getCommentsByPostId(postId, nextCursor);
      const result = response.data;
      dispatch({ type: "ADD_MORE_COMMENTS", payload: result.data });

      setNextCursor(result.nextCursor);
    } catch (error) {
      console.error("Error loading more comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleCommentActions = (action: CommentAction) => {
    dispatch(action);
    if (action.type === ADD_NEW_COMMENT || action.type === ADD_NEW_REPLY) {
      changeCommentCount(1);
    }
    if (action.type === DELETE_COMMENT) {
      changeCommentCount(-1);
    }
  };

  return (
    <section className="px-4">
      <h2 className="text-title-2 tablet:text-headline-2 font-semibold text-black-100">
        댓글 {totalCommentCount}
      </h2>
      <CommentForm
        type="create"
        postId={postId}
        onSuccess={handleCommentActions}
      />
      {commentList.length > 0 && (
        <CommentIList
          isLoadingComments={isLoadingComments}
          nextCursor={nextCursor}
          commentList={commentList}
          onLoadMore={handleLoadMoreComments}
          onAction={handleCommentActions}
        />
      )}
    </section>
  );
}
