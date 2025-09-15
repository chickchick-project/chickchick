"use client";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { COMMUNITY_BOARDS } from "@/lib/constants/communityBoard";
import { Header } from "./header";
import CommunityCards from "./communityCards";
import {
  fetchCommunityPostList,
  getApiSortBy,
  getUniquePostList,
} from "./community.helpers";
import { PostResponse } from "@/lib/hono/schemas/community.schema";
import { Option, TSortBy } from "@/lib/constants/options";
import { PostCategory } from "@prisma/client";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useIntersectionObserver } from "@/lib/hooks/useIntersectionObserver";

export interface SearchResponse<T> {
  data: T[]; // 검색된 목록
  nextCursor: string | null; // 다음 페이지를 위한 커서 (없으면 null)
  totalCount?: number | null;
}

export default function PageClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedTab = searchParams.get("tab") || "BEST";
  const sortByFromUrl = searchParams.get("sort") as TSortBy | null;
  const searchKeyword = searchParams.get("q") || "";

  const [inputValue, setInputValue] = useState(searchKeyword);
  const moreRef = useRef<HTMLDivElement>(null);

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

  // const fetcher = useMemo(
  //   () =>
  //     withCache((cursor: string | null) =>
  //       fetchCommunityPostList({
  //         cursor,
  //         searchText: searchKeyword,
  //         category:
  //           selectedTab === "BEST" ? undefined : (selectedTab as PostCategory),
  //         sortBy: sortByForApi,
  //       })
  //     ),
  //   [searchKeyword, selectedTab, sortByForApi]
  // );

  // const { data, isLoading, moreRef, isIdle } =
  //   useInfiniteScroll<PostResponse>(fetcher);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<
      SearchResponse<PostResponse>,
      Error,
      InfiniteData<SearchResponse<PostResponse>>,
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

  const isIntersecting = useIntersectionObserver(moreRef);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const uniquePostData = useMemo(() => {
    const allPosts = data?.pages.flatMap((page) => page.data) ?? [];
    return getUniquePostList(allPosts);
  }, [data]);

  const isIdle = !isLoading && uniquePostData.length === 0;

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
