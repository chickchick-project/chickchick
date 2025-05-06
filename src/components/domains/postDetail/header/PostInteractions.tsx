"use client";
import { useState } from "react";

import { BookmarkIcon } from "@/components/commons/interactions/icons/BookmarkIcon";
import { LikeIcon } from "@/components/commons/interactions/icons/LikeIcon";
import { ShareIcon } from "@/components/commons/interactions/icons/ShareIcon";
import { Interactions } from "@/components/commons/interactions";

export default function PostInteractions() {
  const [activeStates, setActiveStates] = useState({
    like: false,
    bookmark: false,
  });

  const toggle = (key: keyof typeof activeStates) => {
    setActiveStates((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const interactions = [
    {
      type: "like",
      isActive: activeStates.like,
      onClick: () => toggle("like"),
      label: "좋아요",
      icon: <LikeIcon isActive={activeStates.like} />,
    },
    {
      type: "bookmark",
      isActive: activeStates.bookmark,
      onClick: () => toggle("bookmark"),
      label: "북마크",
      icon: <BookmarkIcon isActive={activeStates.like} />,
    },
    {
      type: "share",
      onClick: () => alert("공유!"),
      label: "공유",
      icon: <ShareIcon />,
    },
  ];

  return (
    <>
      <Interactions items={interactions} />
    </>
  );
}
