import { useEffect, useRef } from "react";
import type { UseBoundStore, StoreApi } from "zustand";
import type { GenericRecentItem } from "../stores/createRecentItemsStore";
import { createHttpClient } from "../utils/core-request";

interface UseRecentItemsSyncOptions<T> {
  useStore: UseBoundStore<
    StoreApi<{
      items: GenericRecentItem<T>[];
      lastSyncedAt: number | null;
      setLastSyncedAt: (timestamp: number) => void;
    }>
  >;
  apiEndpoint: string;
  syncInterval?: number;
}

type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
};

const API_BASE_URL = "http://localhost:3000/api/v1";

const apiClient = createHttpClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || API_BASE_URL,
});

export function useRecentItemsSync<T>({
  useStore,
  apiEndpoint,
  syncInterval = 10000,
}: UseRecentItemsSyncOptions<T>) {
  const items = useStore((state) => state.items);
  const lastSyncedAt = useStore((state) => state.lastSyncedAt);
  const setLastSyncedAt = useStore((state) => state.setLastSyncedAt);
  const setItems = useStore(
    (state) =>
      (state as any).setItems as (items: GenericRecentItem<T>[]) => void
  );

  const isSyncingRef = useRef(false);

  useEffect(() => {
    // 로컬이 비어있고 아직 동기화된 적이 없다면 서버에서 가져오기
    const hydrateFromServer = async () => {
      const res = await apiClient.get<null, ApiEnvelope<any>>(
        `/me/${apiEndpoint}`
      );
      if (!res || !res.success) return;
      const serverItems = res.data?.items ?? [];
      const mapped: GenericRecentItem<T>[] = serverItems.map((it: any) => {
        const viewedAt = new Date(it.viewedAt).getTime();
        if (apiEndpoint === "recent-perfumes") {
          const p = it.perfume;
          const mappedItem: any = {
            id: p.id,
            perfumeName: p.nameKo ?? p.nameEn,
            brandName: p.brand?.nameKo ?? p.brand?.nameEn ?? "",
            imageUrl: p.perfumeImage?.imageUrl ?? "",
          };
          return {
            id: p.id,
            type: "perfume",
            item: mappedItem,
            viewedAt,
          } as GenericRecentItem<T>;
        } else if (apiEndpoint === "recent-posts") {
          const post = it.post;
          return {
            id: post.id,
            type: "post",
            item: post as T,
            viewedAt,
          } as GenericRecentItem<T>;
        }
        return {
          id: it.id,
          type: "unknown",
          item: it as T,
          viewedAt,
        } as GenericRecentItem<T>;
      });
      if (mapped.length > 0) {
        setItems(mapped);
        setLastSyncedAt(Date.now());
      }
    };

    if (items.length === 0 && !lastSyncedAt) {
      hydrateFromServer();
    }
    // 동기화할 아이템이 없으면 중단
    if (items.length === 0) return;

    const syncToServer = async () => {
      if (isSyncingRef.current) return;

      const itemsToSync = lastSyncedAt
        ? items.filter((item) => item.viewedAt > lastSyncedAt)
        : items;

      if (itemsToSync.length === 0) return;

      try {
        isSyncingRef.current = true;
        console.log(`Syncing ${itemsToSync.length} items to ${apiEndpoint}...`);

        const body =
          apiEndpoint === "recent-perfumes"
            ? { perfumeIds: itemsToSync.map((i) => String(i.id)) }
            : apiEndpoint === "recent-posts"
            ? { postIds: itemsToSync.map((i) => String(i.id)) }
            : itemsToSync; // 확장 대비 기본 동작

        const response = await apiClient.post<
          typeof body,
          ApiEnvelope<unknown>
        >(`/me/${apiEndpoint}`, body);

        if (!response || !response.success) {
          throw new Error(`Failed to sync: ${response?.message ?? "Unknown"}`);
        }

        setLastSyncedAt(Date.now());
        console.log("Sync successful.");
      } catch (error) {
        console.error("Failed to sync recent items to server:", error);
      } finally {
        isSyncingRef.current = false;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        syncToServer();
      }
    };

    const interval = setInterval(syncToServer, syncInterval);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [items, lastSyncedAt, setLastSyncedAt, apiEndpoint, syncInterval]);
}
