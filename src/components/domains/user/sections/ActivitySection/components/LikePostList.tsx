import React from "react";
import Link from "next/link";
import { PostCard } from "@/components/commons/card/postCard";
import { POST_CARD_TYPES } from "@/shared/constants/post";
import type { ApiPostResponse } from "@/server/hono/schemas/community.schema";

export const LikePostList = ({
  likedPosts,
}: {
  likedPosts: ApiPostResponse[];
}) => {
  return likedPosts.length > 0 ? (
    <div className="flex flex-col gap-4 tablet:grid pc:grid-cols-2 tablet:grid-cols-1 tablet:justify-items-center tablet:gap-5">
      {likedPosts.map((item) => (
        <Link key={item.id} href={`/community/post/${item.id}`}>
          <PostCard post={item} cardType={POST_CARD_TYPES.SMALL} />
        </Link>
      ))}
    </div>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 게시글이 없습니다.
    </div>
  );
};
