import { useState, useCallback, useMemo } from "react";

interface UseFooterPaginationOptions<T> {
  items: T[];
  itemsPerPage: number;
  enabled?: boolean;
}

interface UseFooterPaginationReturn<T> {
  currentIndex: number;
  visibleItems: T[];
  hasPrev: boolean;
  hasNext: boolean;
  handlePrev: () => void;
  handleNext: () => void;
  reset: () => void;
}

export const useFooterPagination = <T,>({
  items,
  itemsPerPage,
  enabled = true,
}: UseFooterPaginationOptions<T>): UseFooterPaginationReturn<T> => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleItems = useMemo(() => {
    if (!enabled) {
      return items;
    }
    return items.slice(currentIndex, currentIndex + itemsPerPage);
  }, [items, currentIndex, itemsPerPage, enabled]);

  const hasPrev = useMemo(() => {
    return enabled && currentIndex > 0;
  }, [enabled, currentIndex]);

  const hasNext = useMemo(() => {
    return enabled && currentIndex + itemsPerPage < items.length;
  }, [enabled, currentIndex, itemsPerPage, items.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - itemsPerPage));
  }, [itemsPerPage]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) =>
      Math.min(prev + itemsPerPage, items.length - itemsPerPage)
    );
  }, [itemsPerPage, items.length]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
  }, []);

  return {
    currentIndex,
    visibleItems,
    hasPrev,
    hasNext,
    handlePrev,
    handleNext,
    reset,
  };
};
