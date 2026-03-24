import { useEffect } from "react";
import type { UseBoundStore, StoreApi } from "zustand";

type StoreWithAddItem<T> = UseBoundStore<
  StoreApi<{
    addItem: (newItem: { id: string; item: T }) => void;
  }>
>;

export function useLogRecentItem<T extends { id: string }>(
  item: T | null | undefined,
  useStore: StoreWithAddItem<T>
) {
  const addItem = useStore((state) => state.addItem);

  useEffect(() => {
    if (item) {
      addItem({
        id: item.id,
        item: item,
      });
    }
  }, [item, addItem]);
}
