import Link from "next/link";
import PostTime from "../author/PostTime";

interface ICommunityListItem {
  title: string;
  commentCount: number;
  createdAt: string | Date;
  authorName: string;
  postId: string;
  isCurrent?: boolean;
}
const CommunityListItem = ({
  title,
  commentCount,
  createdAt,
  postId,
  authorName,
  isCurrent = false,
}: ICommunityListItem) => {
  const MAX_COUNT = 999;
  const commentCountNumber = commentCount;
  const formattedCount =
    commentCountNumber > MAX_COUNT ? `${MAX_COUNT}+` : commentCountNumber;
  const createdAtToString =
    createdAt instanceof Date ? createdAt.toISOString() : createdAt;
  return (
    <article
      className={`relative w-full px-3 py-2 tablet:py-2 tablet:px-2 flex items-center justify-between tablet:grid tablet:grid-cols-[1fr_160px_100px] tablet:items-center tablet:text-body-2 ${
        isCurrent && "bg-gray-300"
      }`}
    >
      <div className="flex items-baseline min-w-0">
        <h2
          className={`text-black line-clamp-2 text-body-2 leading-normal tablet:ml-2 tablet:text-body-2 tablet:line-clamp-none tablet:truncate  ${
            isCurrent && "tablet:font-semibold"
          }`}
        >
          <Link
            href={`/community/post/${postId}`}
            className="before:absolute before:inset-0 before:content-[''] tablet:before:hidden"
          >
            {title}
          </Link>
        </h2>
        <span className="hidden tablet:block tablet:pl-1 tablet:text-primary-100 tablet:font-medium tablet:flex-shrink-0">
          [{formattedCount}]
        </span>
      </div>
      <div className="hidden tablet:contents">
        <span className="tablet:text-black-100 tablet:truncate tablet:pl-7 text-label-2">
          {authorName}
        </span>
        <div className="tablet:pl-5 tablet:flex tablet:justify-center">
          <PostTime type="post" time={createdAtToString} size="medium" />
        </div>
      </div>
      <div
        className={`w-12 h-fit shrink-0 ml-3 px-1 py-2 flex flex-col items-center ${
          isCurrent ? "bg-white" : "bg-gray-300"
        } rounded-md tablet:hidden`}
      >
        <span className="text-label-1 text-black-100">{formattedCount}</span>
        <span className="text-xs text-black-100">댓글</span>
      </div>
    </article>
  );
};

export default CommunityListItem;
