import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";
import type { UseBoundStore, StoreApi } from "zustand";
import type { ApiPostDetailResponse } from "@/server/hono/schemas/community.schema";

// ─── createRecentItemsStore (factory) ─────────────────────────────────────────

export type GenericRecentItem<T> = {
  id: string;
  type: string;
  item: T;
  viewedAt: number;
};

export interface RecentItemsState<T> {
  items: GenericRecentItem<T>[];
  lastSyncedAt: number | null;
  _hasHydrated: boolean;
  setLastSyncedAt: (timestamp: number) => void;
  addItem: (newItem: { id: string; item: T }) => void;
  setItems: (items: GenericRecentItem<T>[]) => void;
  clearItems: () => void;
}

interface CreateRecentItemsStoreOptions {
  name: string;
  maxItems: number;
  type: string;
}

export function createRecentItemsStore<T>({
  name,
  maxItems,
  type,
}: CreateRecentItemsStoreOptions) {
  return create<RecentItemsState<T>>()(
    persist(
      (set, get) => ({
        items: [],
        lastSyncedAt: null,
        _hasHydrated: false,
        setLastSyncedAt: (timestamp: number) =>
          set({ lastSyncedAt: timestamp }),
        addItem: (newItem) => {
          const currentItems = get().items;

          const filteredItems = currentItems.filter(
            (item) => item.id !== newItem.id
          );

          const newItemWithTimestamp: GenericRecentItem<T> = {
            ...newItem,
            type,
            viewedAt: Date.now(),
          };

          const updatedItems = [newItemWithTimestamp, ...filteredItems];
          const slicedItems = updatedItems.slice(0, maxItems);

          set({ items: slicedItems });
        },
        setItems: (items) => {
          set({ items });
        },
        clearItems: () => set({ items: [], lastSyncedAt: null }),
      }),
      {
        name,
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state._hasHydrated = true;
          }
        },
      }
    )
  );
}

// ─── Filter ───────────────────────────────────────────────────────────────────

interface FilterStore {
  committedFilters: Record<string, string[]>;
  pendingFilters: Record<string, string[]>;

  handlePendingChange: (category: string, value: string) => void;
  handlePendingSingleChange: (category: string, value: string) => void;
  resetPending: () => void;
  commitFilters: (category: string) => void;
  cancelPending: (category: string) => void;
  initializePending: () => void;

  closeFilter: (id: string) => void;
  resetFilters: () => void;

  // 레거시 호환성
  filters: Record<string, string[]>;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  committedFilters: {},
  pendingFilters: {},

  handlePendingChange: (category, value) =>
    set((state) => {
      const newPending = { ...state.pendingFilters };
      const prevArray = newPending[category] ?? [];

      const nextArray = prevArray.includes(value)
        ? prevArray.filter((v) => v !== value)
        : [...prevArray, value].sort();

      if (nextArray.length === 0) {
        delete newPending[category];
      } else {
        newPending[category] = nextArray;
      }

      return { pendingFilters: newPending };
    }),

  // 단일 선택 카테고리 (gender 등): 기존 값을 교체
  handlePendingSingleChange: (category, value) =>
    set((state) => {
      const newPending = { ...state.pendingFilters };
      const current = newPending[category];

      // 이미 같은 값이면 선택 해제
      if (current?.length === 1 && current[0] === value) {
        delete newPending[category];
      } else {
        newPending[category] = [value];
      }

      return { pendingFilters: newPending };
    }),

  resetPending: () =>
    set(() => ({
      pendingFilters: {},
    })),

  commitFilters: (category) =>
    set((state) => {
      const newCommitted = { ...state.committedFilters };
      const pendingValue = state.pendingFilters[category];

      if (pendingValue && pendingValue.length > 0) {
        newCommitted[category] = pendingValue;
      } else {
        delete newCommitted[category];
      }

      return {
        committedFilters: newCommitted,
      };
    }),

  cancelPending: (category) =>
    set((state) => {
      const newPending = { ...state.pendingFilters };
      const committedValue = state.committedFilters[category];

      if (committedValue && committedValue.length > 0) {
        newPending[category] = [...committedValue];
      } else {
        delete newPending[category];
      }

      return { pendingFilters: newPending };
    }),

  initializePending: () =>
    set((state) => ({
      pendingFilters: JSON.parse(JSON.stringify(state.committedFilters)),
    })),

  closeFilter: (id) =>
    set((state) => {
      const newCommitted = { ...state.committedFilters };
      for (const category in newCommitted) {
        const values = newCommitted[category];
        if (values.includes(id)) {
          const nextArray = values.filter((v) => v !== id);
          if (nextArray.length === 0) {
            delete newCommitted[category];
          } else {
            newCommitted[category] = nextArray;
          }
        }
      }
      const newPending = { ...state.pendingFilters };
      for (const category in newPending) {
        const values = newPending[category];
        if (values.includes(id)) {
          const nextArray = values.filter((v) => v !== id);
          if (nextArray.length === 0) {
            delete newPending[category];
          } else {
            newPending[category] = nextArray;
          }
        }
      }
      return { committedFilters: newCommitted, pendingFilters: newPending };
    }),

  resetFilters: () =>
    set({
      committedFilters: {},
      pendingFilters: {},
    }),

  // 레거시 호환성
  get filters() {
    return get().committedFilters;
  },
}));

// ─── Recent Perfumes ──────────────────────────────────────────────────────────

type RecentPerfumeData = {
  id: string;
  perfumeName: string;
  brandName: string;
  imageUrl: string;
};

export type RecentPerfumeItem = GenericRecentItem<RecentPerfumeData>;

export const useRecentPerfumesStore = createRecentItemsStore<RecentPerfumeData>(
  {
    name: "recent-perfumes",
    maxItems: 10,
    type: "perfume",
  }
);

// ─── Recent Posts ─────────────────────────────────────────────────────────────

export type RecentPostItem = GenericRecentItem<ApiPostDetailResponse>;

export const useRecentPostsStore =
  createRecentItemsStore<ApiPostDetailResponse>({
    name: "recent-posts",
    maxItems: 10,
    type: "post",
  });

// ─── useLogRecentItem (hook) ──────────────────────────────────────────────────

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
