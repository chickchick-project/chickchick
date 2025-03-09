import React from "react";
import AuthorInfo from "../../author/AuthorInfo";
import BoardChip from "../../chip/boardChip";
import PostMeta from "../../author/PostMeta";
import Thumbnail from "./Thumbnail";

import {
  POST_CARD_STYLES,
  POST_CARD_TYPES,
  CategoryType,
  PostCardType,
} from "@/lib/constants/post";
import { PostMetaItem } from "@/lib/constants/author";

export interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  meta: PostMetaItem[];
  thumbnail?: string;
  isCategory?: boolean;
  categoryType: CategoryType;
  cardType?: PostCardType;
  profileImage?: string;
  isAuthor: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  title,
  content,
  author,
  createdAt,
  meta,
  thumbnail,
  isCategory = false,
  categoryType,
  cardType = POST_CARD_TYPES.DEFAULT,
  profileImage,
  isAuthor = false,
}) => {
  const contentClamp =
    cardType === POST_CARD_TYPES.DEFAULT ? "line-clamp-4" : "line-clamp-3";
  const cardStyle = POST_CARD_STYLES[cardType];

  return (
    <article
      className={`border border-gray-200 rounded-lg p-6 text-body-2 flex flex-col gap-3 h-full ${cardStyle}`}
    >
      {/* 헤더 */}
      {isCategory && (
        <header className="flex justify-between items-center">
          <BoardChip type={categoryType} />
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
          <p className={`text-gray-600 flex-1 ${contentClamp}`}>{content}</p>
          <Thumbnail thumbnail={thumbnail} cardType={cardType} />
        </div>
      </main>

      {/* 푸터 */}
      <footer className="w-full flex justify-between">
        <AuthorInfo
          author={author}
          createdAt={createdAt}
          profileImage={profileImage}
          isAuthor={isAuthor}
        />
        {cardType !== POST_CARD_TYPES.DETAIL && <PostMeta meta={meta} />}
      </footer>
    </article>
  );
};
