import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { PostTimeProps } from "./author.types";
import { SIZE_STATUSES } from "./author.constants";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.locale("ko");
dayjs.extend(utc);

export default function PostTime({ time, type, size }: PostTimeProps) {
  const now = dayjs();
  const postDate = dayjs(time);

  const diffInHours = now.diff(postDate, "hour");

  let formattedTime = "";

  if (type === "comment") {
    formattedTime = postDate.format("YYYY.M.D HH:mm");
  } else if (diffInHours < 24) {
    formattedTime = postDate.fromNow();
  } else {
    formattedTime = postDate.format("YYYY.M.D");
  }

  return (
    <span
      className={`${
        size === SIZE_STATUSES.DEFAULT
          ? "text-label-4 tablet:text-label-2"
          : "text-body-1"
      } font-medium ${type === "comment" ? "text-gray-100" : "text-black-300"}`}
    >
      {formattedTime}
    </span>
  );
}
