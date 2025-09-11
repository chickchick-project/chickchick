"use client";

import { ButtonFilledPrimaryLFit } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFit } from "@/components/commons/button/ButtonOutlined";
import Comment from "@/components/commons/comment";
import { useState } from "react";
import { ICommentFormProps } from "./postComment.types";
import { createNewComment } from "../comment.helper";

export default function CommentForm({
  type,
  value,
  commentId,
  // parentId, // 답글 수정시 필요
  onSuccess,
  postId,
}: ICommentFormProps) {
  const [inputValue, setInputValue] = useState(value || "");

  const onChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    try {
      let response;
      switch (type) {
        case "create":
          response = await createNewComment(postId, {
            content: inputValue,
          });
          if (response.success) {
            setInputValue("");
            onSuccess?.({ type: "ADD_NEW_COMMENT", payload: response.data });
          }

          break;
        case "reply":
          response = await createNewComment(postId, {
            content: inputValue,
            parentId: commentId,
          });
          if (response.success) {
            setInputValue("");
            onSuccess?.({
              type: "ADD_NEW_REPLY",
              payload: response.data,
            });
          }

          break;
        case "edit":
          alert("댓글 id:" + commentId + "댓글 수정: " + inputValue); //수정 api 구현 후 연동 필요
          // onSuccess?.();
          break;
      }

      setInputValue("");
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
          onClick={() => handleSubmit}
          disabled={!inputValue.trim()}
          type="submit"
        >
          댓글 작성
        </ButtonFilledPrimaryLFit>
      )}
      {type === "reply" && (
        <ButtonOutlinedPrimaryLFit
          onClick={() => handleSubmit}
          disabled={!inputValue.trim()}
          type="submit"
        >
          답글 작성
        </ButtonOutlinedPrimaryLFit>
      )}
      {type === "edit" && (
        <ButtonOutlinedPrimaryLFit
          onClick={() => handleSubmit}
          disabled={!inputValue.trim()}
          type="submit"
        >
          댓글 수정
        </ButtonOutlinedPrimaryLFit>
      )}
    </form>
  );
}
