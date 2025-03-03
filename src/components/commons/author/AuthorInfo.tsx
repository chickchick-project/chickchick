import React from "react";
import AuthorProfile from "./AuthorProfile";
import IconBadge from "./IconBadge";
import PostTime from "./PostTime";
import {
  SIZE_STATUSES,
  META_ICONS,
  MetaType,
  ReviewStatusType,
  SizeStatusType,
} from "@/lib/constants/author";

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
  profileImage: string;
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

  // 1. 내가 작성한 포스트가 아닐 경우 → 작성자 추가
  if (!isAuthor) {
    items.push(
      <AuthorProfile key="author" name={author} profileImage={profileImage} />
    );
  }

  // 2. 작성 시간 추가
  items.push(<PostTime key="time" time={createdAt} size={size} />);

  // 3. info가 존재할 경우만 추가
  if (info) {
    switch (info.type) {
      case "review":
        items.push(<span key="status">{info.item.status}</span>);
        break;

      case "post":
        items.push(
          <div key="meta" className="flex items-center gap-2">
            {info.item.map((meta) => (
              <IconBadge
                key={meta.type}
                iconSrc={META_ICONS[meta.type]}
                altText={meta.type}
                count={meta.count}
              />
            ))}
          </div>
        );
        break;
    }
  }

  return (
    <div
      className={`flex items-center justify-between ${
        size === SIZE_STATUSES.DEFAULT ? "text-label-2" : "text-body-1"
      } font-medium text-black-300`}
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
