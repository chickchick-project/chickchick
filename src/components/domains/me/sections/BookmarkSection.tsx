import React from "react";
import { SubTabSwitcher } from "@/components/domains/me/tabs/SubTabs";

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
  return (
    <SubTabSwitcher
      defaultKey="perfumes"
      tabs={[
        {
          key: "perfumes",
          label: "향수",
          content: (
            <div className="grid grid-cols-5 gap-[52px]">
              {data.perfumes.map((item) => (
                <section
                  key={item.id}
                  className="p-4 border rounded-md bg-gray-50 shadow-sm"
                  aria-label={item.name}
                >
                  <p className="text-sm text-gray-800">{item.name}</p>
                </section>
              ))}
            </div>
          ),
        },
        {
          key: "community",
          label: "커뮤니티",
          content: (
            <div className="space-y-4">
              {data.community.map((item) => (
                <article
                  key={item.id}
                  className="p-4 border rounded-md bg-white shadow-sm"
                >
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </article>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
};
