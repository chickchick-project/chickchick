"use client";

import { useState, useRef, useEffect } from "react";
import { ACTION_TYPES, Actions } from "@/components/commons/actions";
import { REVIEW_STATUSES } from "@/components/commons/author/author.constants";
import AuthorInfo from "@/components/commons/author/AuthorInfo";
import ReviewChip from "@/components/commons/chip/ReviewChip";
import clsx from "clsx";

const MAX_VISIBLE_TAGS_DEFAULT = 3;
const MAX_VISIBLE_LINS_DEFAULT = 3;

export const ReviewCard = ({
  content,
  tags,
  author,
  createdAt,
  profileImage,
  isMain,
}: {
  content: string;
  tags: string[];
  author: string;
  createdAt: string;
  profileImage: string;
  isMain: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleTags = isExpanded
    ? tags
    : tags.slice(0, MAX_VISIBLE_TAGS_DEFAULT);
  const hiddenCount = tags.length - visibleTags.length;

  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isContentClamped, setIsContentClamped] = useState(false);
  const [isTagOverflowing, setIsTagOverflowing] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight || "0"
      );
      const lines = contentRef.current.clientHeight / lineHeight;
      setIsContentClamped(lines > MAX_VISIBLE_LINS_DEFAULT);
    }
    setIsTagOverflowing(tags.length > MAX_VISIBLE_TAGS_DEFAULT);
  }, [tags.length]);

  return (
    <div className="shadow-card rounded-xl p-6 flex flex-col gap-4">
      <header className="flex justify-between">
        <AuthorInfo
          size="large"
          author={author}
          createdAt={createdAt}
          isAuthor={false}
          profileImage={profileImage}
          info={{ type: "review", item: { status: REVIEW_STATUSES.WANT } }}
        />
        {isMain && (
          <Actions
            actions={[
              { type: ACTION_TYPES.EDIT, onClick: () => alert("수정 클릭") },
              { type: ACTION_TYPES.DELETE, onClick: () => alert("삭제 클릭") },
            ]}
          />
        )}
      </header>
      <p
        ref={contentRef}
        className={clsx(
          isExpanded ? "" : "line-clamp-3",
          "text-black-100 font-medium text-body-2 leading-[150%]"
        )}
      >
        {content}
      </p>
      <footer className="flex justify-between items-end">
        <ul className="flex flex-wrap gap-1">
          {visibleTags.map((label, i) => (
            <ReviewChip key={i} label={label} />
          ))}
          {!isExpanded && hiddenCount > 0 && (
            <ReviewChip label={`+${hiddenCount}`} />
          )}
        </ul>
        {(isContentClamped || isTagOverflowing) && (
          <button
            className="text-black-300 font-medium text-label-1"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "접기" : "더보기"}
          </button>
        )}
      </footer>
    </div>
  );
};
