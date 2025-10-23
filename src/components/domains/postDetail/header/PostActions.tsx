"use client";
import { ActionItem, Actions } from "@/components/commons/actions";
import { useRouter } from "next/navigation";
import usePostMutation from "../../post/usePostMutation";

interface IPostActions {
  section?: "header" | "content";
  postId: string;
}

export default function PostActions({
  section = "header",
  postId,
}: IPostActions) {
  const { deleteMutation } = usePostMutation(postId);
  const router = useRouter();

  const handleDeletePost = () => {
    if (window.confirm("게시글을 삭제하시겠습니까?")) {
      //모달로 교체 예정
      deleteMutation.mutate();
    }
  };

  const actions: ActionItem[] = [
    {
      type: "edit",
      label: "수정",
      onClick: () => router.push(`/community/post/${postId}/edit`),
    },
    {
      type: "delete",
      label: "삭제",
      onClick: () => handleDeletePost(),
      disabled: deleteMutation.isPending,
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
