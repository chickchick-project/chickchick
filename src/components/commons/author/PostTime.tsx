import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import { InfoType, SizeStatusType } from "./author.types";
import { SIZE_STATUSES } from "./author.constants";
import utc from "dayjs/plugin/utc";

dayjs.extend(relativeTime);
dayjs.locale("ko");
dayjs.extend(utc);

interface PostTimeProps {
  time: string;
  type: InfoType["type"];
  size: SizeStatusType;
}

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

  const SIZE_STYLES = {
    [SIZE_STATUSES.DEFAULT]: "text-label-4 tablet:text-label-2",
    [SIZE_STATUSES.MEDIUM]: "text-label-2",
    [SIZE_STATUSES.LARGE]: "text-body-1",
  };

  return (
    <span
      className={`${SIZE_STYLES[size]} font-medium ${
        type === "comment" ? "text-black-200" : "text-black-100"
      }`}
    >
      {formattedTime}
    </span>
  );
}
