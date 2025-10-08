"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { getLayoutSize } from "./reviewCard.helpers";
import { ReviewCardProps } from "./reviewCard.types";
import AuthorInfo from "../../author/AuthorInfo";
import ReviewChip from "../../chip/ReviewChip";
import { getCategoryById, getTagByKey } from "@/lib/utils/review.helpers";

export default function ReviewCard({
  review,
  isMyPage = false,
  isAuthor = false,
}: ReviewCardProps) {
  const [isAuthorResponsive, setIsAuthorResponsive] = useState(isAuthor);
  const articleRef = useRef<HTMLElement | null>(null);

  const handleResize = useCallback((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const newIsAuthorResponsiveBasedOnWidth = entry.contentRect.width < 656;
      setIsAuthorResponsive((prevIsAuthorResponsive) =>
        newIsAuthorResponsiveBasedOnWidth !== prevIsAuthorResponsive
          ? newIsAuthorResponsiveBasedOnWidth
          : prevIsAuthorResponsive
      );
    }
  }, []);

  useEffect(() => {
    const currentArticleRef = articleRef.current;
    if (!currentArticleRef) return;
    const observer = new ResizeObserver(handleResize);
    observer.observe(currentArticleRef);
    return () => {
      if (currentArticleRef) {
        observer.unobserve(currentArticleRef);
      }
      observer.disconnect();
    };
  }, [handleResize]);

  if (!review) {
    return null;
  }

  // --- 데이터 구조 분해 수정 ---
  const {
    author,
    perfume,
    createdAt,
    content,
    attributeSelections,
    usageStatus,
  } = review;
  const { nameKo: perfumeName, brand, perfumeImage } = perfume;
  const { nameKo: brandName } = brand || {};

  const title = perfumeName || "향수 이름 정보 없음";

  const chipLabels = attributeSelections.map((selection) => {
    const category = getCategoryById(selection.option.attributeId);
    const key = selection.option.value;
    return category ? getTagByKey(category, key) : key;
  });
  const MAX_CHIPS = isMyPage ? 2 : 3;

  const { articleSize, imageSize } = getLayoutSize(isMyPage);

  return (
    <article
      ref={articleRef}
      className={`${articleSize} p-5 gap-3 tablet:p-6 tablet:gap-4 flex rounded-xl shadow-card`}
    >
      {/* 이미지 */}
      {perfumeImage?.imageUrl ? (
        <Image
          src={perfumeImage.imageUrl}
          alt={title}
          width={imageSize.width}
          height={imageSize.height}
          className="object-contain flex-shrink-0 hidden tablet:block"
        />
      ) : (
        <div
          className={`flex-shrink-0 bg-gray-200 border hidden tablet:flex`}
          style={{ width: imageSize.width, height: imageSize.height }}
        />
      )}

      {/* 메인 컨텐츠 */}
      <main className="flex flex-col flex-1">
        <header>
          <h2 className="text-label-4 font-medium text-black-300">
            {brandName}
          </h2>
          <h1 className="text-body-1 font-semibold text-black-100">{title}</h1>
        </header>
        {/* 리뷰 내용 */}
        <p
          className={`line-clamp-2 tablet:line-clamp-3 text-body-2 font-medium tablet:text-body-2 flex-shrink-0`}
        >
          {content}
        </p>
        {/* 리뷰 칩*/}
        <div className="mt-auto flex flex-col gap-2 pt-2">
          {/* 리뷰 칩*/}
          <div className="flex gap-1 flex-wrap">
            {chipLabels.slice(0, MAX_CHIPS).map((label) => (
              <ReviewChip key={label} label={label} />
            ))}
            {chipLabels.length > MAX_CHIPS && (
              <ReviewChip count={chipLabels.length - MAX_CHIPS} />
            )}
          </div>
          {/* 리뷰 메타 정보 */}
          <footer className="flex">
            <AuthorInfo
              author={author}
              createdAt={createdAt}
              isAuthor={isAuthorResponsive}
              info={{
                type: "review",
                item: { status: usageStatus },
              }}
            />
            <div className="flex gap-1" />
          </footer>
        </div>
      </main>
    </article>
  );
}
