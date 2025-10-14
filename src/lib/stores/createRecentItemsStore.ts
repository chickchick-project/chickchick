import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 스토어에 저장될 아이템의 기본 형태 정의
export type GenericRecentItem<T> = {
  id: string;
  type: string; // 'perfume', 'post' 등 아이템 타입을 명시
  item: T;
  viewedAt: number;
};

// 스토어의 상태(State) 타입 정의
interface RecentItemsState<T> {
  items: GenericRecentItem<T>[];
  lastSyncedAt: number | null;
  _hasHydrated: boolean;
  setLastSyncedAt: (timestamp: number) => void;
  addItem: (newItem: { id: string; item: T }) => void;
  setItems: (items: GenericRecentItem<T>[]) => void;
  clearItems: () => void;
}

// 스토어 생성을 위한 설정값 타입 정의
// <<< [수정] 불필요한 제네릭 <T> 제거
interface CreateRecentItemsStoreOptions {
  name: string; // localStorage에 저장될 키 이름
  maxItems: number; // 최대 저장 개수
  type: string; // 아이템 타입
}

/**
 * 최근 본 아이템 목록을 관리하는 Zustand 스토어를 생성하는 팩토리 함수입니다.
 * @param options 스토어 설정 (name, maxItems, type)
 * @returns Zustand 스토어 Hook
 */
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
