"use client";

import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { ACTION_TYPES, Actions } from "@/components/commons/actions";
import AuthorInfo from "@/components/commons/author/AuthorInfo";
import ReviewChip from "@/components/commons/chip/ReviewChip";
import { ReviewItemProps } from "../../review.type";

const MAX_VISIBLE_LINES_DEFAULT = 3;

export const ReviewItem = ({
  content,
  tags,
  author,
  createdAt,
  profileImage,
  isMain,
  usageStatus,
}: ReviewItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isContentClamped, setIsContentClamped] = useState(false);

  const contentRef = useRef<HTMLParagraphElement>(null);

  // useEffect(() => {
  //   if (contentRef.current) {
  //     const lineHeight = parseFloat(
  //       getComputedStyle(contentRef.current).lineHeight || "0"
  //     );
  //     const lines = contentRef.current.clientHeight / lineHeight;
  //     setIsContentClamped(lines > MAX_VISIBLE_LINS_DEFAULT);
  //   }
  // }, [tags.length]);

  useEffect(() => {
    const element = contentRef.current;
    if (element) {
      const computedStyle = getComputedStyle(element);
      const lineHeight = parseFloat(computedStyle.lineHeight);

      if (isNaN(lineHeight)) return;

      const totalHeight = element.scrollHeight;
      const totalLines = Math.round(totalHeight / lineHeight);

      setIsContentClamped(totalLines > MAX_VISIBLE_LINES_DEFAULT);
    }
  }, [content]);

  return (
    <div className="tablet:shadow-card tablet:rounded-xl py-6 px-5 tablet:px-6 flex flex-col gap-4">
      <header className="flex justify-between">
        <AuthorInfo
          size="large"
          author={{
            id: "unknown",
            nickname: author,
            imageUrl: profileImage,
          }}
          createdAt={new Date(createdAt)}
          isAuthor={false}
          info={{
            type: "review",
            item: { status: usageStatus },
          }}
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
      <div>
        <p
          ref={contentRef}
          className={clsx(
            isExpanded ? "" : "line-clamp-3",
            "text-black-100 font-medium text-label-1 tablet:text-body-2 leading-[150%]"
          )}
        >
          {content}
        </p>
        {isContentClamped && (
          <button
            className="w-full text-black-300 font-medium text-label-3 tablet:text-label-1 text-right"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "접기" : "더보기"}
          </button>
        )}
      </div>
      <footer className="flex justify-between items-end">
        <ul className="flex flex-wrap gap-1">
          {tags.map((label) => (
            <ReviewChip key={label} label={label} />
          ))}
        </ul>
      </footer>
    </div>
  );
};
