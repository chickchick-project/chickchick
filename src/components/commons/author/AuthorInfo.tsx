import React from "react";
import AuthorProfile from "./AuthorProfile";
import PostTime from "./PostTime";

import PostMeta from "./PostMeta";
import { SIZE_STATUSES } from "./author.constants";
import { AuthorInfoProps, SizeStatusType } from "./author.types";
import dayjs from "dayjs";

const AuthorInfo: React.FC<AuthorInfoProps> = ({
  size = SIZE_STATUSES.DEFAULT,
  author,
  createdAt,
  isAuthor,
  info = { type: "basic" },
}) => {
  const items = [];

  // 1. 내가 작성한 포스트가 아닐 경우 → 작성자 추가
  if (!isAuthor) {
    items.push(
      <AuthorProfile
        key="author"
        name={author.nickname}
        profileImage={author.imageUrl}
      />
    );
  }

  // 2. 작성 시간 추가
  items.push(
    <PostTime
      key="time"
      type={info.type}
      time={dayjs(createdAt).format("YYYY-MM-DD")}
      size={size}
    />
  );

  switch (info.type) {
    case "review":
      items.push(
        <span key="status">
          {info.item!.status === "CURRENTLY_USING"
            ? "지금 쓰고 있어요"
            : info.item!.status === "USED_BEFORE"
            ? "써 봤어요"
            : "갖고 싶어요"}
        </span>
      );
      break;

    case "post":
      if (Array.isArray(info.item) && info.item.length > 0) {
        items.push(<PostMeta key="meta" meta={info.item} />);
      }
      break;
  }

  return (
    <div
      className={`flex items-center justify-between ${
        size === SIZE_STATUSES.DEFAULT
          ? "text-label-4 tablet:text-label-2"
          : "text-body-1"
      } font-medium text-black-300`}
    >
      <AuthorInfoItems items={items} size={size} />
    </div>
  );
};

export default React.memo(AuthorInfo);

const AuthorInfoItems = ({
  items,
  size,
}: {
  items: React.ReactNode[];
  size: SizeStatusType;
}) => {
  const validItems = items.filter(Boolean);
  if (validItems.length < 2) return <>{validItems}</>;

  return (
    <>
      {validItems.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div
              className={`w-px ${
                size === SIZE_STATUSES.DEFAULT ? "h-3" : "h-4"
              } bg-gray-200 mx-4`}
            />
          )}
          {item}
        </React.Fragment>
      ))}
    </>
  );
};
