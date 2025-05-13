import React from "react";
import dayjs from "dayjs";

const Reply = ({
  content,
  postId,
  createdAt,
  isLast,
}: {
  content: string;
  postId: string;
  createdAt: string;
  isLast?: boolean;
}) => {
  const postTitle = (postId: string) => {
    return postId === "1" ? "[서울 동대문구]올리브영 향수 나눔합니다!" : "";
  };
  return (
    <li className={`${isLast ? "" : "border-b"} p-4`}>
      <div className="flex flex-col items-start gap-2">
        <span className="text-body-1 font-semibold text-black-100">
          {content}
        </span>
        <div className="flex justify-between w-full">
          <div className="flex gap-5">
            <span className="text-black-300 text-label-1 font-medium">
              댓글을 남긴 게시글
            </span>
            <span className="text-primary-200 text-label-1 font-medium">
              {postTitle(postId)}
            </span>
          </div>
          <div className="text-black-300 text-label-1 font-medium">
            {dayjs(createdAt).format("YYYY.MM.DD")}
          </div>
        </div>
      </div>
    </li>
  );
};

export default Reply;
