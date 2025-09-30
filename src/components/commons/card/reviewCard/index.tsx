"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { getLayoutSize } from "./reviewCard.helpers";
import { ReviewCardProps } from "./reviewCard.types";

export default function ReviewCard({
  reviews,
  isMyPage = false,
  isAuthor = false,
}: ReviewCardProps) {
  //컴포넌트 사이즈에 따라 AuthorInfo 값 변경
  const [isAuthorResponsive, setIsAuthorResponsive] = useState(isAuthor);
  const articleRef = useRef<HTMLElement | null>(null);
  const { brand, title, review, createdAt, info, chips, imageUrl } = reviews;

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const newIsAuthorResponsiveBasedOnWidth = entry.contentRect.width < 656;
      setIsAuthorResponsive((prevIsAuthorResponsive) => {
        if (newIsAuthorResponsiveBasedOnWidth !== prevIsAuthorResponsive) {
          return newIsAuthorResponsiveBasedOnWidth;
        }
        return prevIsAuthorResponsive;
      });
    }
  }, []);

  useEffect(() => {
    const currentArticleRef = articleRef.current;
    if (!currentArticleRef) {
      return;
    }

    const observer = new ResizeObserver(handleResize);
    observer.observe(currentArticleRef);

    return () => {
      observer.unobserve(currentArticleRef);
      observer.disconnect();
    };
  }, [handleResize]);

  const MAX_CHIPS = isMyPage ? 2 : 3;

  const { articleSize, imageSize } = getLayoutSize(isMyPage);

  return (
    <article
      ref={articleRef}
      className={`${articleSize}
        p-5 gap-3 tablet:p-6 tablet:gap-4
        flex rounded-xl shadow-card`}
    ></article>
  );
}
