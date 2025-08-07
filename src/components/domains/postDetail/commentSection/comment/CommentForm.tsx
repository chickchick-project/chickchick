"use client";

import { ButtonFilledPrimaryLFit } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFit } from "@/components/commons/button/ButtonOutlined";
import Comment from "@/components/commons/comment";
import { useState } from "react";
import { ICommentFormProps } from "./postComment.types";
import { createNewComment } from "../comment.helper";
import { useRouter } from "next/navigation";

export default function CommentForm({
  type,
  value,
  commentId,
  onSuccess,
  postId,
}: ICommentFormProps) {
  const [inputValue, setInputValue] = useState(value || "");
  const router = useRouter(); // 댓글api 커서 추가시 수정 예정.
  const onChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    try {
      switch (type) {
        case "create":
          await createNewComment(postId, { content: inputValue });
          break;
        case "reply":
          await createNewComment(postId, {
            content: inputValue,
            parentId: commentId,
          });
          router.refresh();
          break;
        case "edit":
          alert("댓글 id:" + commentId + "댓글 수정: " + inputValue);
          break;
      }

      setInputValue("");
      onSuccess?.();
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
