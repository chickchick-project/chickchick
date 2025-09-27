import React from "react";
import Link from "next/link";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import { mockPostCardData } from "@/lib/mocks/postCard";
import { PostCard } from "@/components/commons/card/postCard";
import { PostResponse } from "@/lib/hono/schemas/community.schema";

export const LikePostList = ({
  likedPosts,
}: {
  likedPosts: PostResponse[];
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
