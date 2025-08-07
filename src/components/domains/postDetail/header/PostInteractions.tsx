"use client";
import { useEffect, useState } from "react";
import { BookmarkIcon } from "@/components/commons/interactions/icons/BookmarkIcon";
import { LikeIcon } from "@/components/commons/interactions/icons/LikeIcon";
import { ShareIcon } from "@/components/commons/interactions/icons/ShareIcon";
import { Interactions } from "@/components/commons/interactions";
import { useRouter } from "next/navigation";
import {
  toggleLikedPostById,
  toggleBookmarkedPostById,
} from "../postDetail.helpers";
import { useUserStore } from "@/lib/stores/useUserStore";

interface IPostInteractionsProps {
  initialIsLiked: boolean;
  initialIsBookmarked: boolean;
  postId: string;
}

export default function PostInteractions({
  initialIsLiked,
  initialIsBookmarked,
  postId,
}: IPostInteractionsProps) {
  const router = useRouter();
  const { user, isLoading } = useUserStore();

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const handleLikeToggle = async () => {
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }
    setIsLiked((prev) => !prev);
    try {
      await toggleLikedPostById(postId);
      router.refresh();
    } catch (error) {
      setIsLiked((prev) => !prev);
      alert("좋아요 처리실패.");
      console.error("좋아요 처리 실패:", error);
    }
  };

  const handleBookmarkToggle = async () => {
    if (!user) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }
    setIsBookmarked((prev) => !prev);
    try {
      await toggleBookmarkedPostById(postId);
      router.refresh();
    } catch (error) {
      setIsBookmarked((prev) => !prev);
      alert("북마크 처리 실패.");
      console.error("북마크 처리 실패:", error);
    }
  };

  const interactions = [
    {
      type: "like",
      isActive: isLiked,
      onClick: handleLikeToggle,
      label: "좋아요",
      icon: <LikeIcon isActive={isLiked} />,
    },
    {
      type: "bookmark",
      isActive: isBookmarked,
      onClick: handleBookmarkToggle,
      label: "북마크",
      icon: <BookmarkIcon isActive={isBookmarked} />,
    },
    {
      type: "share",
      onClick: () => alert("공유!"),
      label: "공유",
      icon: <ShareIcon />,
    },
  ];

  useEffect(() => {
    if (!isLoading && !user) {
      setIsLiked(false);
      setIsBookmarked(false);
    }
  }, [user, isLoading]);

  return (
    <>
      <Interactions items={interactions} />
    </>
  );
}
