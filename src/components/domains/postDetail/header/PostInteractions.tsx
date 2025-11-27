"use client";

import { BookmarkIcon } from "@/components/commons/interactions/icons/BookmarkIcon";
import { LikeIcon } from "@/components/commons/interactions/icons/LikeIcon";
import { ShareIcon } from "@/components/commons/interactions/icons/ShareIcon";
import { Interactions } from "@/components/commons/interactions";
import usePostInteractionMutation from "./usePostInteractionMutation";
import { useRef } from "react";
import { useVisibilityStore } from "@/lib/stores/useVisibilityStore";
import ShareDropdownMenu from "@/components/commons/dropdown/ShareDropdownMenu";
import useOnClickOutside from "@/lib/hooks/useOnClickOutside";

interface IPostInteractionsProps {
  isLiked: boolean;
  isBookmarked: boolean;
  postId: string;
}

export default function PostInteractions({
  isLiked,
  isBookmarked,
  postId,
}: IPostInteractionsProps) {
  const { toggleBookmarkMutation, toggleLikeMutation } =
    usePostInteractionMutation(postId);
  const { isPending: isBookmarkPending } = toggleBookmarkMutation;
  const { isPending: isLikePending } = toggleLikeMutation;

  const dropdownId = "shareDropdown";
  const { isOpen, open, close } = useVisibilityStore();
  const shareDropdownRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(shareDropdownRef, () => close(dropdownId));

  const interactions = [
    {
      type: "like",
      isActive: isLiked,
      onClick: () => toggleLikeMutation.mutate(),
      disabled: isLikePending,
      label: "좋아요",
      icon: <LikeIcon isActive={isLiked} />,
    },
    {
      type: "bookmark",
      isActive: isBookmarked,
      onClick: () => toggleBookmarkMutation.mutate(),
      disabled: isBookmarkPending,
      label: "북마크",
      icon: <BookmarkIcon isActive={isBookmarked} />,
    },
    {
      type: "share",
      onClick: () => open(dropdownId),
      label: "공유",
      icon: <ShareIcon />,
    },
  ];

  return (
    <div className="relative">
      <Interactions items={interactions} />
      {isOpen(dropdownId) && (
        <ShareDropdownMenu
          ref={shareDropdownRef}
          closeMenu={() => close(dropdownId)}
        />
      )}
    </div>
  );
}
