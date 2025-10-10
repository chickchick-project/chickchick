"use client";

import { ButtonFilledPrimaryLFit } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFit } from "@/components/commons/button/ButtonOutlined";
import Comment from "@/components/commons/comment";
import { useState } from "react";
import { ICommentFormProps } from "./postComment.types";
import useCommentMutation from "../useCommentMutation";

export default function CommentForm({
  type,
  value,
  commentId,
  parentId,
  onSuccess,
  postId,
}: ICommentFormProps) {
  const [inputValue, setInputValue] = useState(value || "");

  const onChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const { uploadMutation, editMutation } = useCommentMutation(postId);
  const { isPending: isCreating } = uploadMutation;
  const { isPending: isEditing } = editMutation;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    try {
      switch (type) {
        case "create":
          uploadMutation.mutate(
            { content: inputValue },
            { onSuccess: () => setInputValue("") }
          );
          break;
        case "reply":
          uploadMutation.mutate(
            { content: inputValue, parentId: commentId },
            {
              onSuccess: () => {
                setInputValue("");
                onSuccess?.();
              },
            }
          );

          break;
        case "edit":
          if (!commentId) return;
          editMutation.mutate(
            {
              commentId,
              commentData: { content: inputValue, parentId },
            },
            {
              onSuccess: onSuccess,
            }
          );
          break;
      }
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("오류가 발생했습니다. 다시 시도해 주세요.");
    }
  };

  return (
    <form
      className={`flex flex-col ${
        type === "create" ? "gap-5 my-5" : "gap-3"
      } items-end`}
      onSubmit={handleSubmit}
    >
      <Comment type="post" value={inputValue} onChange={onChange} />
      {type === "create" && (
        <ButtonFilledPrimaryLFit
          colorNum="200"
          disabled={!inputValue.trim() || isCreating}
          type="submit"
        >
          댓글 작성
        </ButtonFilledPrimaryLFit>
      )}
      {type === "reply" && (
        <ButtonOutlinedPrimaryLFit
          disabled={!inputValue.trim() || isCreating}
          type="submit"
        >
          답글 작성
        </ButtonOutlinedPrimaryLFit>
      )}
      {type === "edit" && (
        <ButtonOutlinedPrimaryLFit
          disabled={!inputValue.trim() || isEditing}
          type="submit"
        >
          댓글 수정
        </ButtonOutlinedPrimaryLFit>
      )}
    </form>
  );
}
