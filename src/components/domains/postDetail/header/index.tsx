import AuthorInfo from "@/components/commons/author/AuthorInfo";
import { InfoType } from "@/components/commons/author/author.types";
import BoardChip from "@/components/commons/chip/BoardChip";
import PostInteractions from "./PostInteractions";
import PostActions from "./PostActions";
import { TPostDetail } from "@/lib/queries/community/postQueries";

interface IPostDetailHeaderProps extends Omit<TPostDetail, "content"> {}

export default function PostDetailHeader(props: IPostDetailHeaderProps) {
  const {
    author,
    title,
    createdAt,
    isAuthor,
    isLiked,
    bookmarkInfo,
    category,
    viewCount,
    likeCount,
    commentCount,
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
        <BoardChip type={category} />
        <PostInteractions isLiked={isLiked} bookmarkInfo={bookmarkInfo} />
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
