"use client";

import { useEffect, useRef, useReducer, useCallback } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

/**
 * 검색 API 응답 데이터
 *
 * @property {T[]} data - 검색된 목록
 * @property {string | null} nextCursor - 다음 페이지를 위한 커서 (없으면 null)
 * @property {number | null} [totalCount] - (optional) 총 항목 수 (없으면 null)
 */
export interface SearchResponse<T> {
  data: T[]; // 검색된 목록
  nextCursor: string | null; // 다음 페이지를 위한 커서 (없으면 null)
  totalCount?: number | null;
}

// 상태 타입
type State<T> = {
  data: T[];
  totalCount: number | null;
  cursor: string | null;
  isIdle: boolean;
  isLoading: boolean;
  hasMore: boolean;
  error: Error | null;
};

// 액션 타입
type Action<T> =
  | { type: "RESET" }
  | { type: "FETCH_START" }
  | {
      type: "FETCH_SUCCESS";
      payload: SearchResponse<T>;
    }
  | { type: "FETCH_ERROR"; payload: Error };

// 초기 상태 팩토리
const initialState = <T>(): State<T> => ({
  data: [],
  totalCount: 0,
  cursor: null,
  isIdle: true,
  isLoading: false,
  hasMore: true,
  error: null,
});

// 리듀서 함수
function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "RESET":
      return initialState<T>();
    case "FETCH_START":
      return { ...state, isIdle: false, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: state.cursor
          ? [...state.data, ...action.payload.data]
          : action.payload.data,
        cursor: action.payload.nextCursor,
        hasMore: !!action.payload.nextCursor,
        totalCount: action.payload.totalCount ?? state.totalCount,
      };
    case "FETCH_ERROR":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        hasMore: false,
      };
    default:
      return state;
  }
}

export function useInfiniteScroll<T>(
  fetchFunction: (cursor: string | null) => Promise<SearchResponse<T>>
) {
  const moreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(moreRef);

  const [state, dispatch] = useReducer(reducer<T>, undefined, initialState);
  const { data, totalCount, cursor, isLoading, hasMore, error, isIdle } = state;
  const fetchData = useCallback(
  
    async (currentCursor: string | null) => {
      dispatch({ type: "FETCH_START" });

      try {
        const res = await fetchFunction(currentCursor);
        if (!Array.isArray(res.data)) {
          throw new Error("데이터 형식이 잘못되었습니다.");
        }

        dispatch({
          type: "FETCH_SUCCESS",
          payload: res,
        });
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: err instanceof Error ? err : new Error(String(err)),
        });
      }
    },
    [fetchFunction]
  );

  // 초기화 및 첫 fetch
  useEffect(() => {
    dispatch({ type: "RESET" });
    fetchData(null);
  }, [fetchData]);

  // Intersection 감지 시 추가 fetch
  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading && !isIdle) {
      fetchData(cursor);
    }
  }, [isIntersecting, hasMore, isLoading, cursor, fetchData, isIdle]);

  // 수동 refetch
  const refetch = useCallback(() => {
    dispatch({ type: "RESET" });
    fetchData(null);
  }, [fetchData]);

  return {
    moreRef,
    data,
    totalCount,
    isLoading,
    hasMore,
    error,
    refetch,
    isIdle,
  };
}
