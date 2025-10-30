import React from "react";
import Link from "next/link";
import { PostCard } from "@/components/commons/card/postCard";
import { Spinner } from "@/components/commons/loading/Spinner";
import { POST_CARD_TYPES } from "@/lib/constants/post";
import { ApiPostResponse } from "@/lib/hono/schemas/community.schema";

interface ICommunityCardsProps {
  postData: ApiPostResponse[];
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
            postData.map((item) => (
              <Link
                key={item.id}
                href={`/community/post/${item.id}?from=${selectedTab}`}
              >
                <PostCard
                  key={item.id}
                  post={item}
                  cardType={POST_CARD_TYPES.SMALL}
                />
              </Link>
            ))}
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
