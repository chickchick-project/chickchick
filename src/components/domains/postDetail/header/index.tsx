import AuthorInfo from "@/components/commons/author/AuthorInfo";
import { InfoType } from "@/components/commons/author/author.types";
import BoardChip from "@/components/commons/chip/BoardChip";
import PostInteractions from "./PostInteractions";
import PostActions from "./PostActions";
import {
  ApiPostDetailResponse,
  ApiPostStatusResponse,
} from "@/server/hono/schemas/community.schema";
import Link from "next/link";

type PostDetailHeaderProps = Omit<ApiPostDetailResponse, "content"> & {
  postStatus: ApiPostStatusResponse;
};

export default function PostDetailHeader(props: PostDetailHeaderProps) {
  const {
    author,
    title,
    createdAt,
    isAuthor,
    category,
    id: postId,
    postStatus: { isLiked, viewCount, commentCount, likeCount, isBookmarked },
  } = props;
  const postReactionInfo: InfoType = {
    type: "post",
    item: [
      { type: "View", count: viewCount },
      { type: "Comment", count: commentCount },
      { type: "Like", count: likeCount },
    ],
  };

  return (
    <header className="mobile:mt-10 pc:mt-[60px] px-4">
      <div className="flex item-center justify-between">
        <Link href={`/community?tab=${category}`}>
          <BoardChip type={category} />
        </Link>
        <PostInteractions
          isLiked={isLiked}
          isBookmarked={isBookmarked}
          postId={postId}
        />
      </div>
      <h1 className="mt-5 mb-4 tablet:mb-5 text-title-1 tablet:text-headline-3 font-semibold text-black-100">
        {title}
      </h1>
      <div className="flex items-center justify-between">
        <AuthorInfo
          author={{
            ...author,
            imageUrl: author.imageUrl || "",
          }}
          createdAt={new Date(createdAt)}
          isAuthor={false}
          info={postReactionInfo}
        />
        {isAuthor && <PostActions section="header" postId={postId} />}
      </div>
      <div className="divider-horizontal mt-4 tablet:mt-5 mb-10" />
    </header>
  );
}
