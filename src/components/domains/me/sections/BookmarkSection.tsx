import React from "react";
import { SubTabSwitcher } from "@/components/domains/me/tabs/SubTabs";
import PerfumeCard from "@/components/commons/card/perfumeCard";
import { PostCard } from "@/components/commons/card/postCard";
import { MOCK_POST_CARD } from "@/components/domains/me/sections/mocks/postCard";
import { MOCK_PERFUME_CARD } from "@/components/domains/me/sections/mocks/perfumeCard";

type PerfumeBookmark = {
  id: number;
  name: string;
};

type CommunityBookmark = {
  id: number;
  title: string;
  category: string;
};

type BookmarkData = {
  perfumes: PerfumeBookmark[];
  community: CommunityBookmark[];
};

export const BookmarkSection = ({ data }: { data: BookmarkData }) => {
  const extendedPerfumes = Array.from({ length: 10 }).flatMap(
    () => data.perfumes
  );
  const extendedCommunity = Array.from({ length: 2 }).flatMap(
    () => data.community
  );
  return (
    <SubTabSwitcher
      defaultKey="perfumes"
      tabs={[
        {
          key: "perfumes",
          label: "향수",
          content: (
            <div className="grid grid-cols-5 gap-[52px]">
              {extendedPerfumes.map((item, idx) => (
                <PerfumeCard {...MOCK_PERFUME_CARD} key={`${item.id}-${idx}`} />
              ))}
            </div>
          ),
        },
        {
          key: "community",
          label: "커뮤니티",
          content: (
            <div className="grid grid-cols-2 gap-y-5">
              {extendedCommunity.map((item, idx) => (
                <PostCard
                  key={`${item.id}-${idx}`}
                  id={item.id.toString()}
                  {...MOCK_POST_CARD}
                />
              ))}
            </div>
          ),
        },
      ]}
    />
  );
};
