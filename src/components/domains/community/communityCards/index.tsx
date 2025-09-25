import React from "react";
import Link from "next/link";
import { PostCard } from "@/components/commons/card/postCard";
import { PostResponse } from "@/lib/hono/schemas/community.schema";
import { Spinner } from "@/components/commons/loading/Spinner";

interface ICommunityCardsProps {
  postData: PostResponse[];
  selectedTab: string;
  isLoading?: boolean;
  isIdle?: boolean;
  moreRef?: React.RefObject<HTMLDivElement>;
}
export default function CommunityCards({
  postData,
  selectedTab,
  isLoading,
  isIdle,
  moreRef,
}: ICommunityCardsProps) {
  return (
    <section className="w-full">
      {!isIdle && postData.length === 0 && !isLoading ? (
        <div className="flex justify-center items-center flex-1">
          검색 결과가 없습니다.
        </div>
      ) : (
        <div className="grid grid-col-1 tablet:grid-cols-2 tablet:gap-y-5 tablet:gap-x-5 pc:gap-x-10 max-w-[1200px]">
          {postData.length > 0 &&
            postData.map(
              ({
                id,
                title,
                contentText,
                author,
                createdAt,
                category,
                thumbnailUrl,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ..._rest
              }) => (
                <Link
                  key={id}
                  href={`/community/post/${id}?from=${selectedTab}`}
                >
                  <PostCard
                    id={id}
                    thumbnail={thumbnailUrl}
                    thumbnailUrl={thumbnailUrl}
                    title={title}
                    content={contentText}
                    contentText={contentText}
                    author={{
                      ...author,
                      imageUrl: author.imageUrl || "",
                    }}
                    createdAt={new Date(createdAt)}
                    updatedAt={new Date(createdAt)}
                    category={category}
                    isCategory={selectedTab === "BEST"}
                    isAuthor={false}
                    userId={author.id}
                    published={true}
                    viewCount={0}
                    likeCount={0}
                    commentCount={0}
                  />
                </Link>
              )
            )}
        </div>
      )}
      <div ref={moreRef} className="py-10 text-center">
        {isLoading && (
          <div className="flex justify-center items-center">
            <Spinner />
          </div>
        )}
      </div>
    </section>
  );
}
