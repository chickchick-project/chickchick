import { useEffect } from "react";
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
  const { ref: moreRef, isIntersecting } = useIntersectionObserver(threshold);

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return moreRef;
}
