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

  const isSyncingRef = useRef(false);

  useEffect(() => {
    // 동기화할 아이템이 없으면 중단
    if (items.length === 0) return;

    const syncToServer = async () => {
      if (isSyncingRef.current) return;

      const latestViewedAt = Math.max(...items.map((item) => item.viewedAt));

      if (lastSyncedAt && latestViewedAt <= lastSyncedAt) return;

      try {
        isSyncingRef.current = true;
        console.log(`Syncing ${items.length} items to ${apiEndpoint}...`);

        const body =
          apiEndpoint === "recent-perfumes"
            ? { perfumeIds: items.map((i) => String(i.id)) }
            : apiEndpoint === "recent-posts"
            ? { postIds: items.map((i) => String(i.id)) }
            : items; // 확장 대비 기본 동작

        const response = await apiClient.post<typeof body, ApiEnvelope<unknown>>(
          `/me/${apiEndpoint}`,
          body
        );

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

    syncToServer();

    const interval = setInterval(syncToServer, syncInterval);

    return () => clearInterval(interval);
  }, [items, lastSyncedAt, setLastSyncedAt, apiEndpoint, syncInterval]);
}
