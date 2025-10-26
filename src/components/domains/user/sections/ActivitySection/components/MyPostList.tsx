import React from "react";
import Link from "next/link";
import { PostCard } from "@/components/commons/card/postCard";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import { ApiPostResponse } from "@/lib/hono/schemas/community.schema";

export const MyPostList = ({ posts }: { posts: ApiPostResponse[] }) => {
  return posts.length > 0 ? (
    <div className="flex flex-col gap-4 tablet:grid pc:grid-cols-2 tablet:grid-cols-1 tablet:justify-items-center tablet:gap-5">
      {posts.map((item) => (
        <Link key={item.id} href={`/community/post/${item.id}`}>
          <PostCard
            key={item.id}
            post={item}
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
