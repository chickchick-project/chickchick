import React from "react";
import { PostCard } from "@/components/commons/card/postCard";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import Link from "next/link";
import { mockPostCardData } from "@/lib/mocks/postCard";
import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";

export const MyPostList = ({ posts }: { posts: PostCardProps[] }) => {
  return posts.length > 0 ? (
    <div className="grid grid-cols-2 justify-items-center">
      {posts.map((item) => (
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
      작성한 게시글이 없습니다.
    </div>
  );
};

export default MyPostList;
