"use client";
import { ActionItem, Actions } from "@/components/commons/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deletePostById } from "../postDetail.helpers";

interface IPostActions {
  section?: "header" | "content";
  postId: string;
}

export default function PostActions({
  section = "header",
  postId,
}: IPostActions) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDeletePost = async (postId: string) => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      try {
        setIsLoading(true);
        const response = await deletePostById(postId);
        if (response.success) {
          alert("게시글이 삭제되었습니다.");
          router.push("/community");
        }
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
        alert((error as Error).message || "게시글 삭제에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const actions: ActionItem[] = [
    {
      type: "edit",
      label: "수정",
      onClick: () => {},
    },
    {
      type: "delete",
      label: "삭제",
      onClick: () => handleDeletePost(postId),
      disabled: isLoading,
    },
  ];

  const display =
    section === "header" ? "hidden tablet:block" : "block tablet:hidden";
  return (
    <div className={display}>
      <Actions actions={actions} />
    </div>
  );
}
