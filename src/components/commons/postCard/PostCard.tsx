import React from "react";
import Image from "next/image";
import ViewIcon from "public/icons/meta/View.svg";
import LikeIcon from "public/icons/meta/Like.svg";
import CommentIcon from "public/icons/meta/Comment.svg";
import IconBadge from "../author/IconBadge";
import AuthorInfo from "../author/AuthorInfo";
import {
  CATEGORY_LABELS,
  POST_CARD_STYLES,
  POST_CARD_TYPES,
  CategoryType,
  PostCardType,
} from "@/lib/constants/post";

export interface PostMetaData {
  likes: number;
  comments: number;
  views: number;
}

export interface PostCardProps {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  meta: PostMetaData;
  thumbnail?: string;
  isCategory?: boolean;
  categoryType: CategoryType;
  cardType?: PostCardType;
  profileImage: string;
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
          <CategoryBadge categoryType={categoryType} />
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
          {thumbnail && <Thumbnail thumbnail={thumbnail} cardType={cardType} />}
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

/** 카테고리 뱃지 */
const CategoryBadge: React.FC<{ categoryType: CategoryType }> = ({
  categoryType,
}) => {
  if (!categoryType) return null;

  return (
    <span className="border border-primary-300 text-primary-300 text-xs px-2 py-1 rounded-[4px]">
      {CATEGORY_LABELS[categoryType]}
    </span>
  );
};

/** 썸네일 */
const Thumbnail: React.FC<{
  thumbnail?: string;
  cardType: PostCardType;
}> = ({ thumbnail, cardType }) => {
  if (!thumbnail) return null;

  const thumbnailSizes = {
    [POST_CARD_TYPES.SMALL]: { width: 80, height: 80 },
    [POST_CARD_TYPES.DEFAULT]: { width: 100, height: 100 },
    [POST_CARD_TYPES.DETAIL]: { width: 307, height: 180 },
  };

  return (
    <Image
      src={thumbnail}
      alt="게시글 썸네일"
      width={thumbnailSizes[cardType].width}
      height={thumbnailSizes[cardType].height}
      className="object-cover rounded-md"
    />
  );
};

/** 좋아요, 댓글, 조회수 */
const PostMeta: React.FC<{ meta: PostMetaData }> = ({ meta }) => {
  return (
    <div className="flex gap-2">
      <IconBadge iconSrc={LikeIcon} altText="좋아요" count={meta.likes} />
      <IconBadge iconSrc={CommentIcon} altText="댓글" count={meta.comments} />
      <IconBadge iconSrc={ViewIcon} altText="조회수" count={meta.views} />
    </div>
  );
};

export default PostMeta;
