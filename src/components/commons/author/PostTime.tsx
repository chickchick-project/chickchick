import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import {
  InfoType,
  SIZE_STATUSES,
  SizeStatusType,
} from "@/lib/constants/author";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface PostTimeProps {
  time: string;
  type: InfoType["type"];
  size: SizeStatusType;
}

const PostTime: React.FC<PostTimeProps> = ({ time, type, size }) => {
  const now = dayjs();
  const postDate = dayjs(time);
  const diffInHours = now.diff(postDate, "hour");

  let formattedTime = "";

  if (type === "comment") {
    formattedTime = postDate.format("YYYY.M.D HH:mm");
  } else if (diffInHours < 24) {
    formattedTime = `${diffInHours}시간 전`;
  } else {
    formattedTime = postDate.format("YYYY.M.D");
  }

  return (
    <span
      className={`${
        size === SIZE_STATUSES.DEFAULT ? "text-label-2" : "text-body-1"
      } font-medium text-black-300`}
    >
      {formattedTime}
    </span>
  );
};

export default PostTime;
