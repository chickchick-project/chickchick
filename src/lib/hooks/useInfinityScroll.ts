"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

export function useInfiniteScroll<T>(
  fetchFunction: (
    cursor: string | null,
    query: string
  ) => Promise<{ data: T[]; nextCursor: { last_seen_id: string } | null }>,
  query: string
) {
  const moreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(moreRef);
  const [data, setData] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // `query`가 변경될 때 상태를 초기화
  useEffect(() => {
    setCursor(null);
    setData([]);
    setHasMore(true);
    setError(null);
  }, [query]);

  // fetchData 함수를 메모이제이션하여 불필요한 재렌더링 방지
  const fetchData = useCallback(async () => {
    if (!hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFunction(cursor, query);

      // 응답 데이터 구조 검증
      if (!response || !Array.isArray(response.data)) {
        throw new Error(
          "잘못된 데이터 형식입니다. data 배열이 포함된 객체가 필요합니다."
        );
      }

      // 기존 데이터에 새로운 데이터를 추가 (또는 검색어 변경 시 초기화)
      setData((prevData) =>
        cursor ? [...prevData, ...response.data] : response.data
      );

      // 다음 페이지를 위한 커서 업데이트
      const nextCursor = response.nextCursor?.last_seen_id || null;
      setCursor(nextCursor);
      setHasMore(!!nextCursor);
    } catch (error) {
      console.error("데이터 불러오기 실패:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, cursor, query, hasMore]);

  useEffect(() => {
    if (data.length === 0 && !isLoading) {
      fetchData(); // 최초 진입 시 강제 fetch
    }
  }, [data.length, isLoading, fetchData]);

  // 요소가 화면에 나타날 때 데이터를 가져옴
  useEffect(() => {
    if (isIntersecting) {
      fetchData();
    }
  }, [isIntersecting, isLoading, fetchData]);

  // 수동으로 데이터 다시 불러오기
  const refetch = useCallback(() => {
    setCursor(null);
    setData([]);
    setHasMore(true);
    setError(null);
    fetchData(); // 수동으로 강제 fetch
  }, [fetchData]);

  return {
    moreRef,
    isLoading,
    data,
    hasMore,
    error,
    refetch,
  };
}
