"use client";
import { useCallback, useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { withCache } from "@/lib/utils/withCache";
import { COMMUNITY_BOARDS } from "@/lib/constants/communityBoard";
import { Header } from "./header";
import CommunityCards from "./communityCards";
import {
  fetchCommunityPostList,
  getApiSortBy,
  getUniquePostList,
} from "./community.helpers";
import { PostResponse } from "@/lib/hono/schemas/community.schema";
import { useInfiniteScroll } from "@/lib/hooks/useInfinityScroll";
import { Option, TSortBy } from "@/lib/constants/options";
import { PostCategory } from "@prisma/client";

export default function PageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get("tab") || "BEST";
  const sortByFromUrl = searchParams.get("sort") as TSortBy | null;
  const searchKeyword = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(searchKeyword);

  const boards = Object.entries(COMMUNITY_BOARDS).map(([key, value]) => ({
    key,
    label: value,
  }));

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      params.delete("cursor");
      return params.toString();
    },
    [searchParams]
  );

  const handleTabClick = (key: string) => {
    const paramsToUpdate: Record<string, string> = { tab: key };
    paramsToUpdate.sort = "";
    router.push(`${pathname}?${createQueryString(paramsToUpdate)}`);
  };
  const handleSortChange = (newSortBy: Option) => {
    router.push(`${pathname}?${createQueryString({ sort: newSortBy.value })}`);
  };

  const handleSearchSubmit = () => {
    router.push(`${pathname}?${createQueryString({ q: inputValue })}`);
  };

  const sortByForApi = getApiSortBy(selectedTab, sortByFromUrl);

  const fetcher = useMemo(
    () =>
      withCache((cursor: string | null) =>
        fetchCommunityPostList({
          cursor,
          searchText: searchKeyword,
          category:
            selectedTab === "BEST" ? undefined : (selectedTab as PostCategory),
          sortBy: sortByForApi,
        })
      ),
    [searchKeyword, selectedTab, sortByForApi]
  );

  useEffect(() => {
    setInputValue(searchKeyword);
  }, [searchKeyword]);

  const { data, isLoading, moreRef, isIdle } =
    useInfiniteScroll<PostResponse>(fetcher);
  const uniquePostData = useMemo(() => getUniquePostList(data), [data]);

  return (
    <div className="px-4 w-full flex flex-col  gap-5">
      <Header
        boards={boards}
        selectedTab={selectedTab}
        handleTabClick={handleTabClick}
        currentSortBy={sortByFromUrl}
        handleSortChange={handleSortChange}
        searchKeyword={inputValue}
        handleSearchChange={(e) => setInputValue(e.target.value)}
        handleSearchSubmit={handleSearchSubmit}
      />
      <main className="pb-[280px] tablet:max-w-[1200px]">
        <CommunityCards
          postData={uniquePostData}
          selectedTab={selectedTab}
          isLoading={isLoading}
          moreRef={moreRef}
          isIdle={isIdle}
        />
      </main>
    </div>
  );
}
