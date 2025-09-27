import React from "react";
import Link from "next/link";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import { mockPostCardData } from "@/lib/mocks/postCard";
import { PostCard } from "@/components/commons/card/postCard";

export const LikePostList = ({ likedPosts }: { likedPosts: any[] }) => {
  return likedPosts.length > 0 ? (
    <ul className="space-y-2">
      {likedPosts.map((item) => (
        <Link key={item.id} href={`/community/post/${item.id}`}>
          <PostCard
            key={item.id}
            {...mockPostCardData}
            isAuthor={false}
            isCategory={true}
            cardType={POST_CARD_TYPES.SMALL}
          />
        </Link>
      ))}
    </ul>
  ) : (
    <div className="text-center py-8 text-gray-500">
      좋아요 한 게시글이 없습니다.
    </div>
  );
};
