import React from "react";
import AuthorProfile from "./AuthorProfile";
import IconBadge from "./IconBadge";
import PostTime from "./PostTime";
import ViewIcon from "public/icons/meta/View.svg";
import LikeIcon from "public/icons/meta/Like.svg";
import CommentIcon from "public/icons/meta/Comment.svg";

export const REVIEW_STATUSES = {
  NOW: "지금 쓰고 있어요",
  USED: "써 봤어요",
  WANT: "갖고 싶어요",
} as const;

export const SIZE_STATUSES = {
  DEFAULT: "default",
  LARGE: "large",
} as const;

type MetaType = "likes" | "comments" | "views";

export type ReviewStatusType =
  (typeof REVIEW_STATUSES)[keyof typeof REVIEW_STATUSES];

export type SizeStatusType = (typeof SIZE_STATUSES)[keyof typeof SIZE_STATUSES];

interface MetaItem {
  type: MetaType;
  count: number;
}

interface PostInfo {
  type: "post";
  item: MetaItem[];
}

interface ReviewInfo {
  type: "review";
  item: { status: ReviewStatusType };
}

type InfoType = PostInfo | ReviewInfo | undefined;

export interface AuthorInfoProps {
  size?: SizeStatusType;
  author: string;
  createdAt: string;
  profileImage?: string;
  isAuthor: boolean;
  info?: InfoType;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({
  size = SIZE_STATUSES.DEFAULT,
  author,
  createdAt,
  profileImage,
  isAuthor,
  info,
}) => {
  const items = [];

  const getIcon = (type: MetaType) => {
    switch (type) {
      case "likes":
        return LikeIcon;
      case "comments":
        return CommentIcon;
      case "views":
        return ViewIcon;
      default:
        return ViewIcon;
    }
  };

  // 내가 작성한 포스트가 아닐 경우
  if (!isAuthor) {
    items.push(
      <AuthorProfile key="author" name={author} profileImage={profileImage} />
    );
  }

  // 작성 시간 추가
  items.push(<PostTime key="time" time={createdAt} size={size} />);

  // info가 없으면 기본 정보만 반환
  if (!info) {
    return (
      <div
        className={`flex items-center ${
          size === SIZE_STATUSES.DEFAULT ? "text-label-2" : "text-body-1"
        } font-medium text-gray-500`}
      >
        {addDividers(items, size)}
      </div>
    );
  }

  // 리뷰인 경우
  if (info.type === "review") {
    items.push(
      <span key="status" className="text-black-300 text-sm font-medium">
        {info.item.status}
      </span>
    );
  }

  // 게시글인 경우
  if (info.type === "post") {
    const metaItems = info.item.map((meta) => (
      <IconBadge
        key={meta.type}
        iconSrc={getIcon(meta.type)}
        altText={meta.type}
        count={meta.count}
      />
    ));

    if (metaItems.length > 0) {
      items.push(
        <div key="meta" className="flex items-center gap-2">
          {metaItems}
        </div>
      );
    }
  }

  return (
    <div
      className={`flex items-center justify-between ${
        size === SIZE_STATUSES.DEFAULT ? "text-label-2" : "text-body-1"
      }  text-black-300`}
    >
      {addDividers(items, size)}
    </div>
  );
};

export default React.memo(AuthorInfo);

const addDividers = (items: React.ReactNode[], size: SizeStatusType) => {
  if (items.length < 2) return items;

  return items.reduce<React.ReactNode[]>((acc, item, index) => {
    if (index > 0) {
      acc.push(
        <div
          key={`divider-${index}`}
          className={`w-px ${
            size === SIZE_STATUSES.DEFAULT ? "h-3" : "h-4"
          } bg-gray-200 mx-4`}
        />
      );
    }
    acc.push(item);
    return acc;
  }, []);
};
