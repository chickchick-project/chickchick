"use client";

import { ButtonFilledPrimaryLFit } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFit } from "@/components/commons/button/ButtonOutlined";
import Comment from "@/components/commons/comment";
import { useState } from "react";
import { ICommentFormProps } from "./postComment.types";
export default function CommentForm({
  type,
  value,
  commentId,
  onSubmit,
}: ICommentFormProps) {
  const [inputValue, setInputValue] = useState(value || "");

  const onChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    switch (type) {
      case "create":
        alert("댓글 작성: " + inputValue);

        break;
      case "reply":
        alert("댓글 id:" + commentId + "답글 작성: " + inputValue);
        onSubmit?.();
        break;
      case "edit":
        alert("댓글 id:" + commentId + "댓글 수정: " + inputValue);
        onSubmit?.();
        break;
    }
    setInputValue("");
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
