import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { SIZE_STATUSES, SizeStatusType } from "./AuthorInfo";

dayjs.extend(relativeTime);
dayjs.locale("ko");

interface PostTimeProps {
  time: string;
  size: SizeStatusType;
}

const PostTime: React.FC<PostTimeProps> = ({ time, size }) => {
  const now = dayjs();
  const postDate = dayjs(time);
  const diffInHours = now.diff(postDate, "hour");

  const formattedTime =
    diffInHours < 24 ? `${diffInHours}시간 전` : postDate.format("YYYY.M.D");

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
