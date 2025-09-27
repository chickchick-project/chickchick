import React from "react";
import { PostCard } from "@/components/commons/card/postCard";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import Link from "next/link";
import { mockPostCardData } from "@/lib/mocks/postCard";

export const MyPostList = ({ posts }: { posts: any[] }) => {
  return posts.length > 0 ? (
    <ul className="space-y-2">
      {posts.map((item) => (
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
      작성한 게시글이 없습니다.
    </div>
  );
};

export default MyPostList;
