"use client";
import { ActionItem, Actions } from "@/components/commons/actions";

interface IPostActions {
  section?: "header" | "content";
}

export default function PostActions({ section = "header" }: IPostActions) {
  const actions: ActionItem[] = [
    {
      type: "edit",
      label: "수정",
      onClick: () => {},
    },
    { type: "delete", label: "삭제", onClick: () => {} },
  ];

  const display =
    section === "header" ? "hidden tablet:block" : "block tablet:hidden";
  return (
    <div className={display}>
      <Actions actions={actions} />
    </div>
  );
}
