import { PostCard } from "@/components/commons/card/postCard";
import React from "react";
import { TCommunityPost } from "@/lib/mocks/communityCard";

interface ICommunityCardsProps {
  postData: TCommunityPost[];
  selectedTab: string;
}
export default function CommunityCards({
  postData,
  selectedTab,
}: ICommunityCardsProps) {
  return (
    <section className="w-full">
      <div className="grid grid-col-1 tablet:grid-cols-2 tablet:gap-y-5 tablet:gap-x-10 max-w-[1200px]">
        {postData &&
          postData.map(
            ({ id, title, content, author, createdAt, meta, categoryType }) => (
              <PostCard
                key={id}
                id={id}
                title={title}
                content={content}
                author={author}
                createdAt={createdAt}
                profileImage={""}
                meta={meta}
                categoryType={categoryType}
                isCategory={selectedTab === "best"}
                isAuthor={false}
              />
            )
          )}
      </div>
    </section>
  );
}
