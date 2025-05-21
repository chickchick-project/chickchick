"use client";

import { useState, useRef, useEffect } from "react";
import { ACTION_TYPES, Actions } from "@/components/commons/actions";
import { REVIEW_STATUSES } from "@/components/commons/author/author.constants";
import AuthorInfo from "@/components/commons/author/AuthorInfo";
import ReviewChip from "@/components/commons/chip/ReviewChip";
import clsx from "clsx";

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
  const [isContentClamped, setIsContentClamped] = useState(false);

  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(contentRef.current).lineHeight || "0"
      );
      const lines = contentRef.current.clientHeight / lineHeight;
      setIsContentClamped(lines > MAX_VISIBLE_LINS_DEFAULT);
    }
  }, [tags.length]);

  return (
    <div className="tablet:shadow-card tablet:rounded-xl py-6 px-5 tablet:px-6 flex flex-col gap-4">
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
          {tags.map((label, i) => (
            <ReviewChip key={i} label={label} />
          ))}
        </ul>
      </footer>
    </div>
  );
};
