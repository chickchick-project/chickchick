"use client";

import AuthorInfo from "../../author/AuthorInfo";
import BoardChip from "../../chip/BoardChip";
import PostMeta from "../../author/PostMeta";
import Thumbnail from "./Thumbnail";
import { POST_CARD_STYLES, POST_CARD_TYPES } from "./postCard.constants";
import { PostCardProps } from "./postCard.types";
import { PostMetaItem } from "../../author/author.types";

export function PostCard({
  title,
  contentText,
  author,
  createdAt,
  thumbnailUrl,
  isCategory = false,
  category,
  cardType = POST_CARD_TYPES.DEFAULT,
  isAuthor = false,
  ...rest
}: PostCardProps) {
  const contentClamp =
    cardType === POST_CARD_TYPES.DEFAULT ? "line-clamp-4" : "line-clamp-3";
  const cardStyle = POST_CARD_STYLES[cardType];

  const meta: PostMetaItem[] = [
    {
      type: "Like",
      count: rest.likeCount as number,
    },
    {
      type: "Comment",
      count: rest.commentCount as number,
    },
    {
      type: "View",
      count: rest.viewCount as number,
    },
  ];
  return (
    <article
      className={`border border-gray-200 rounded-lg p-6 text-body-2 flex flex-col gap-3 tablet:max-w-full h-full shadow-card ${cardStyle}`}
    >
      {/* 헤더 */}
      {isCategory && (
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
        <h3 className="text-body-1 font-semibold line-clamp-1">{title}</h3>

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
          <p className={`text-gray-600 flex-1 ${contentClamp}`}>
            {contentText}
          </p>
          <Thumbnail thumbnail={thumbnailUrl} cardType={cardType} />
        </div>
      </main>

      {/* 푸터 */}
      <footer className="w-full flex justify-between">
        <AuthorInfo author={author} createdAt={createdAt} isAuthor={isAuthor} />
        {cardType !== POST_CARD_TYPES.DETAIL && <PostMeta meta={meta} />}
      </footer>
    </article>
  );
}
