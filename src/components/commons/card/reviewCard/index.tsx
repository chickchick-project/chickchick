import React, { useEffect, useRef, useState } from "react";
import AuthorInfo from "../../author/AuthorInfo";
import { InfoType } from "@/lib/constants/author";
import ReviewChip from "../../chip/reviewChip";
import Image from "next/image";

export interface ReviewCardProps {
  brand: string;
  title: string;
  review: string;
  createdAt: string;
  info: InfoType;
  chips: Array<string>;
  imageUrl?: string;
  isMyPage: boolean;
  isAuthor: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  brand,
  title,
  review,
  createdAt,
  info,
  chips = Array(8).fill("기본 칩"),
  imageUrl,
  isMyPage = false,
  isAuthor = false,
}) => {
  //컴포넌트 사이즈에 따라 AuthorInfo 값 변경
  const [isAuthorResponsive, setIsAuthorResponsive] = useState(isAuthor);
  const articleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newState = entry.contentRect.width < 656;
        if (newState !== isAuthorResponsive) {
          setIsAuthorResponsive(newState);
        }
      }
    });

    if (articleRef.current) {
      observer.observe(articleRef.current);
    }

    return () => observer.disconnect();
  }, [isAuthorResponsive]);

  const MAX_CHIPS = isMyPage ? 2 : 3;

  const ARTICLE_SIZE = isMyPage
    ? "w-[504px] h-[220px]"
    : "w-[320px] h-[162px] tablet:w-[704px] tablet:h-[248px]";

  const IMAGE_SIZE = isMyPage
    ? { width: 180, height: 180 }
    : { width: 200, height: 200 };

  return (
    <article
      ref={articleRef}
      className={`${ARTICLE_SIZE}
         p-5 gap-3 tablet:p-6 tablet:gap-4
         flex rounded-xl shadow-card`}
    >
      {/* 이미지 (마이페이지가 아닐 때만 표시) */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title}
          width={IMAGE_SIZE.width}
          height={IMAGE_SIZE.height}
          className="object-cover border flex-shrink-0 hidden tablet:block"
        />
      ) : (
        <div
          className={`flex-shrink-0 bg-gray-200 border hidden tablet:flex`}
          style={{ width: IMAGE_SIZE.width, height: IMAGE_SIZE.height }}
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
            author="주현"
            createdAt={createdAt}
            info={info}
            isAuthor={isAuthorResponsive}
          />
        </footer>
      </main>
    </article>
  );
};

export default ReviewCard;
