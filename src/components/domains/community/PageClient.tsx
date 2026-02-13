"use client";
import { useCallback, useMemo, useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { PostCategory } from "@prisma/client";
import { Header } from "./header";
import CommunityCards from "./communityCards";
import {
  fetchCommunityPostList,
  getApiSortBy,
  getUniquePostList,
} from "./community.helpers";
import { Option, TSortBy } from "@/lib/constants/options";
import { useInfiniteScrollTrigger } from "@/lib/hooks/useInfiniteScrollTrigger";
import { COMMUNITY_BOARDS } from "@/lib/constants/communityBoard";
import type { PaginatedApiPostResponse } from "@/lib/hono/schemas/community.schema";

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

  useEffect(() => {
    setInputValue(searchKeyword);
  }, [searchKeyword]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      PaginatedApiPostResponse,
      Error,
      InfiniteData<PaginatedApiPostResponse>,
      (string | null)[],
      string | null
    >({
      queryKey: ["community", selectedTab, sortByFromUrl, searchKeyword],
      queryFn: ({ pageParam }) =>
        fetchCommunityPostList({
          cursor: pageParam,
          searchText: searchKeyword,
          category:
            selectedTab === "BEST" ? undefined : (selectedTab as PostCategory),
          sortBy: sortByForApi,
        }),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: null,
    });

  const moreRef = useInfiniteScrollTrigger({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const uniquePostData = useMemo(() => {
    const allPosts = data?.pages.flatMap((page) => page.data) ?? [];
    const uniquePosts = getUniquePostList(allPosts);
    const postCardProps = uniquePosts.map((post) => ({
      ...post,
      isAuthor: false,
      userId: post.author.id,
      published: true,
    }));
    return postCardProps;
  }, [data]);

  const isIdle = !isLoading && uniquePostData.length === 0;
  return (
    <div className="mobile:p-0 px-4 w-full flex flex-col gap-5">
      <h1 className="sr-only">커뮤니티</h1>
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
      <main className="flex-1 h-full mobile:pb-0 pb-[280px] tablet:px-5 mobile:w-full pc:max-w-[1200px]">
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
