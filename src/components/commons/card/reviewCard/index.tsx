"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import AuthorInfo from "../../author/AuthorInfo";
import ReviewChip from "../../chip/ReviewChip";
import { getLayoutSize } from "./reviewCard.helpers";
import { ReviewCardProps } from "./reviewCard.types";

export default function ReviewCard({
  brand,
  title,
  review,
  createdAt,
  info,
  chips,
  imageUrl,
  isMyPage = false,
  isAuthor = false,
  author,
}: ReviewCardProps) {
  //컴포넌트 사이즈에 따라 AuthorInfo 값 변경
  const [isAuthorResponsive, setIsAuthorResponsive] = useState(isAuthor);
  const articleRef = useRef<HTMLElement | null>(null);

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
    >
      {/* 이미지 (마이페이지가 아닐 때만 표시) */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          width={imageSize.width}
          height={imageSize.height}
          className="object-contain border flex-shrink-0 hidden tablet:block"
        />
      ) : (
        <div
          className={`flex-shrink-0 bg-gray-200 border hidden tablet:flex`}
          style={{ width: imageSize.width, height: imageSize.height }}
        />
      )}

      {/* 메인 컨텐츠 */}
      <main className="flex flex-col gap-1 tablet:gap-2">
        <header>
          <h2 className="text-label-4 font-medium">{brand}</h2>
          <h1 className="text-label-2 font-semibold">{title}</h1>
        </header>
        {/* 리뷰 내용 */}
        <p
          className={`line-clamp-2 tablet:line-clamp-3 text-label-2 tablet:text-body-2 flex-shrink-0`}
        >
          {review}
        </p>
        {/* 리뷰 칩*/}
        <div className="flex gap-1">
          {chips.slice(0, MAX_CHIPS).map((label, index) => (
            <ReviewChip key={index} label={label} />
          ))}
          {chips.length > MAX_CHIPS && (
            <ReviewChip count={chips.length - MAX_CHIPS} />
          )}
        </div>
        {/* 리뷰 메타 정보 */}
        <footer className="flex">
          <AuthorInfo
            author={author}
            createdAt={createdAt}
            info={info}
            isAuthor={isAuthorResponsive}
          />
        </footer>
      </main>
    </article>
  );
}
