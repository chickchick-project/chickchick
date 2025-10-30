import { PostCard } from "@/components/commons/card/postCard";
import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import Link from "next/link";

export const CommunityBookmarkList = ({
  communityPosts,
}: {
  communityPosts: PostCardProps[];
}) => {
  if (communityPosts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        북마크한 게시글이 없습니다.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 tablet:grid pc:grid-cols-2 tablet:grid-cols-1 tablet:gap-y-5">
      {communityPosts.map((item) => (
        <Link key={item.id} href={`/community/post/${item.id}`}>
          <PostCard
            {...item}
            isAuthor={false}
            isCategory={true}
            cardType={POST_CARD_TYPES.SMALL}
          />
        </Link>
      ))}
    </div>
  );
};
