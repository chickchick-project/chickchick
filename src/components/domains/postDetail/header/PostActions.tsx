"use client";
import { ActionItem, Actions } from "@/components/commons/actions";

export default function PostActions() {
  const actions: ActionItem[] = [
    {
      type: "edit",
      label: "수정",
      onClick: () => {},
    },
    { type: "delete", label: "삭제", onClick: () => {} },
  ];
  return (
    <>
      <Actions actions={actions} />
    </>
  );
}
