import { useEffect, useRef } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

interface UseInfiniteScrollTriggerOptions {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => void;
  threshold?: number;
}

export function useInfiniteScrollTrigger({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
  threshold = 0.1,
}: UseInfiniteScrollTriggerOptions) {
  const moreRef = useRef<HTMLDivElement>(null);
  const isIntersecting = useIntersectionObserver(moreRef, threshold);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return moreRef;
}
