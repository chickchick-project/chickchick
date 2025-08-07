import AuthorInfo from "@/components/commons/author/AuthorInfo";
import { InfoType } from "@/components/commons/author/author.types";
import BoardChip from "@/components/commons/chip/BoardChip";
import PostInteractions from "./PostInteractions";
import PostActions from "./PostActions";
import {
  PostDetailResponse,
  PostStatusResponse,
} from "@/lib/hono/schemas/community.schema";

type PostDetailHeaderProps = Omit<PostDetailResponse, "content"> & {
  postStatus: PostStatusResponse;
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
  console.log(isAuthor);
  return (
    <header className="mobile:mt-10 pc:mt-[60px] px-4">
      <div className="flex item-center justify-between">
        <BoardChip type={category} />
        <PostInteractions
          initialIsLiked={isLiked}
          initialIsBookmarked={isBookmarked}
          postId={postId}
        />
      </div>
      <h1 className="mt-5 mb-4 tablet:mb-5 text-title-1 tablet:text-headline-3 font-semibold text-black-100">
        {title}
      </h1>
      <div className="flex items-center justify-between">
        <AuthorInfo
          author={author.nickname}
          createdAt={createdAt}
          profileImage={author.imageUrl || ""}
          isAuthor={false}
          info={postReactionInfo}
        />
        {isAuthor && <PostActions section="header" />}
      </div>
      <div className="divider-horizontal mt-4 tablet:mt-5 mb-10" />
    </header>
  );
}
