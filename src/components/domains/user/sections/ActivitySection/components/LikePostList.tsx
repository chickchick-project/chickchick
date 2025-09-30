import React from "react";
import Link from "next/link";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import { mockPostCardData } from "@/lib/mocks/postCard";
import { PostCard } from "@/components/commons/card/postCard";
import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";

export const LikePostList = ({
  likedPosts,
}: {
  likedPosts: PostCardProps[];
}) => {
  return likedPosts.length > 0 ? (
    <div className="grid grid-cols-2 justify-items-center">
      {likedPosts.map((item) => (
        <Link key={item.id} href={`/community/post/${item.id}`}>
          <PostCard
            key={item.id}
            {...mockPostCardData}
            cardType={POST_CARD_TYPES.SMALL}
          />
        </Link>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 게시글이 없습니다.
    </div>
  );
};
