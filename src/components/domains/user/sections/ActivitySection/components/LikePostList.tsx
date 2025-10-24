import React from "react";
import Link from "next/link";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import { PostCard } from "@/components/commons/card/postCard";
import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";

export const LikePostList = ({
  likedPosts,
}: {
  likedPosts: PostCardProps[];
}) => {
  return likedPosts.length > 0 ? (
    <div className="flex flex-col gap-4 tablet:grid pc:grid-cols-2 tablet:grid-cols-1 tablet:justify-items-center tablet:gap-5">
      {likedPosts.map((item) => (
        <Link key={item.id} href={`/community/post/${item.id}`}>
          <PostCard {...item} cardType={POST_CARD_TYPES.SMALL} />
        </Link>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 게시글이 없습니다.
    </div>
  );
};
