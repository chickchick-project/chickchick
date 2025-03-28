"use client";

import { useEffect, useRef, useReducer, useCallback } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

// 상태 타입
type State<T> = {
  data: T[];
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
  | { type: "FETCH_SUCCESS"; payload: { data: T[]; nextCursor: string | null } }
  | { type: "FETCH_ERROR"; payload: Error };

// 초기 상태 팩토리
const initialState = <T>(): State<T> => ({
  data: [],
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
  fetchFunction: (
    cursor: string | null,
    query: string
  ) => Promise<{ data: T[]; nextCursor: { last_seen_id: string } | null }>,
  query: string
) {
  const moreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(moreRef);

  const [state, dispatch] = useReducer(reducer<T>, undefined, initialState);
  const { data, cursor, isLoading, hasMore, error, isIdle } = state;

  const fetchData = useCallback(
    async (cursorToUse: string | null) => {
      dispatch({ type: "FETCH_START" });

      try {
        const res = await fetchFunction(cursorToUse, query);

        if (!Array.isArray(res.data)) {
          throw new Error("데이터 형식이 잘못되었습니다.");
        }

        dispatch({
          type: "FETCH_SUCCESS",
          payload: {
            data: res.data,
            nextCursor: res.nextCursor?.last_seen_id ?? null,
          },
        });
      } catch (err) {
        dispatch({
          type: "FETCH_ERROR",
          payload: err instanceof Error ? err : new Error(String(err)),
        });
      }
    },
    [fetchFunction, query]
  );

  // 초기화 및 첫 fetch
  useEffect(() => {
    dispatch({ type: "RESET" });
    fetchData(null);
  }, [query, fetchData]);

  // Intersection 감지 시 추가 fetch
  useEffect(() => {
    if (isIntersecting && hasMore && !isLoading) {
      fetchData(cursor);
    }
  }, [isIntersecting, hasMore, isLoading, cursor, fetchData]);

  // 수동 refetch
  const refetch = useCallback(() => {
    dispatch({ type: "RESET" });
    fetchData(null);
  }, [fetchData]);

  return {
    moreRef,
    data,
    isLoading,
    hasMore,
    error,
    refetch,
    isIdle,
  };
}
