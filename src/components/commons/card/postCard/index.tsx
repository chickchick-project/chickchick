"use client";

import AuthorInfo from "../../author/AuthorInfo";
import BoardChip from "../../chip/BoardChip";
import PostMeta from "../../author/PostMeta";
import Thumbnail from "./Thumbnail";
import { POST_CARD_STYLES, POST_CARD_TYPES } from "@/shared/constants/post";
import { PostCardProps } from "./postCard.types";
import { PostMetaItem } from "../../author/author.types";

export function PostCard({
  post,
  cardType = POST_CARD_TYPES.DEFAULT,
  isCategoryVisible = true,
}: PostCardProps) {
  if (!post) {
    return null;
  }

  const {
    title,
    contentText,
    author,
    createdAt,
    thumbnailUrl,
    category,
    likeCount,
    commentCount,
    viewCount,
  } = post;

  const contentClamp =
    cardType === POST_CARD_TYPES.DEFAULT ? "line-clamp-4" : "line-clamp-3";
  const cardStyle = POST_CARD_STYLES[cardType];
  const isAuthor = author.id === localStorage.getItem("userId");
  const meta: PostMetaItem[] = [
    {
      type: "Like",
      count: likeCount as number,
    },
    {
      type: "Comment",
      count: commentCount as number,
    },
    {
      type: "View",
      count: viewCount as number,
    },
  ];
  return (
    <article
      className={`mobile:border-t-0 mobile:border-x-0 border border-gray-200 mobile:rounded-none rounded-lg p-6 text-body-2 flex flex-col gap-3 mobile:w-full tablet:max-w-full h-full tablet:shadow-card ${cardStyle}`}
    >
      {/* 헤더 */}
      {isCategoryVisible && (
        <header className="flex justify-between items-center">
          <BoardChip type={category} />
        </header>
      )}

      {/* 메인 컨텐츠 */}
      <main
        className={`flex flex-col ${
          cardType === POST_CARD_TYPES.DETAIL ? "gap-4" : "gap-2"
        }`}
      >
        <h2 className="text-body-1 font-semibold line-clamp-1">{title}</h2>

        {cardType === POST_CARD_TYPES.DETAIL && (
          <div className="flex justify-end">
            <PostMeta meta={meta} />
          </div>
        )}

        {/* 컨텐츠 & 썸네일 정렬 */}
        <div
          className={`flex ${
            cardType === POST_CARD_TYPES.DETAIL
              ? "flex-col gap-3"
              : "items-center justify-between gap-3"
          }`}
        >
          <p className={`text-black-100 flex-1 ${contentClamp}`}>
            {contentText}
          </p>
          <Thumbnail thumbnail={thumbnailUrl} cardType={cardType} />
        </div>
      </main>

      {/* 푸터 */}
      <footer className="w-full flex justify-between">
        <AuthorInfo
          author={author}
          createdAt={new Date(createdAt)}
          isAuthor={isAuthor}
        />
        {cardType !== POST_CARD_TYPES.DETAIL && <PostMeta meta={meta} />}
      </footer>
    </article>
  );
}
