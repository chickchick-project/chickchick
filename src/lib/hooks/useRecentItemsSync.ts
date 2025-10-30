import { useEffect, useRef } from "react";
import type { UseBoundStore, StoreApi } from "zustand";
import type {
  GenericRecentItem,
  RecentItemsState,
} from "../stores/createRecentItemsStore";
import {
  ApiRecentPerfumeItem,
  ApiRecentPostItem,
  ApiGetRecentPerfumesResponseSchema,
  ApiGetRecentPostsResponseSchema,
} from "../hono/schemas/me.schema";
import { meApi } from "../utils/api/users.api";

type RecentApiEndpoint = "recents/perfumes" | "recents/posts";

interface UseRecentItemsSyncOptions<T> {
  useStore: UseBoundStore<StoreApi<RecentItemsState<T>>>;
  apiEndpoint: RecentApiEndpoint;
  syncInterval?: number;
  enabled?: boolean;
}

const responseSchemaMap = {
  "recents/perfumes": ApiGetRecentPerfumesResponseSchema,
  "recents/posts": ApiGetRecentPostsResponseSchema,
};

export function useRecentItemsSync<T>({
  useStore,
  apiEndpoint,
  syncInterval = 10000,
  enabled = true,
}: UseRecentItemsSyncOptions<T>) {
  const items = useStore((state) => state.items);
  const lastSyncedAt = useStore((state) => state.lastSyncedAt);
  const setLastSyncedAt = useStore((state) => state.setLastSyncedAt);
  const setItems = useStore((state) => state.setItems);

  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    // 로컬이 비어있고 아직 동기화된 적이 없다면 서버에서 가져오기
    const hydrateFromServer = async () => {
      const res =
        apiEndpoint === "recents/perfumes"
          ? await meApi.recents.perfumes.get()
          : await meApi.recents.posts.get();

      if (!res || !res.success) return;

      const schema = responseSchemaMap[apiEndpoint];
      const parsedResponse = schema.safeParse(res.data);
      if (!parsedResponse.success) {
        console.error(
          `[useRecentItemsSync] Failed to parse server response for ${apiEndpoint}:`,
          parsedResponse.error
        );
        return;
      }

      const serverItems = parsedResponse.data.items;
      const mapped: GenericRecentItem<T>[] = serverItems.map((serverItem) => {
        if (apiEndpoint === "recents/perfumes") {
          const p = (serverItem as ApiRecentPerfumeItem).perfume;
          const viewedAt = new Date(
            (serverItem as ApiRecentPerfumeItem).viewedAt
          ).getTime();

          const item = {
            id: p.id,
            perfumeName: p.nameKo ?? p.nameEn ?? "",
            brandName: p.brand?.nameKo ?? p.brand?.nameEn ?? "",
            imageUrl: p.perfumeImage?.imageUrl ?? "",
          } as unknown as T;

          return {
            id: p.id,
            type: "perfume",
            item,
            viewedAt,
          } satisfies GenericRecentItem<T>;
        }
        // recents/posts
        const post = (serverItem as ApiRecentPostItem).post;
        const viewedAt = new Date(
          (serverItem as ApiRecentPostItem).viewedAt
        ).getTime();

        return {
          id: post.id,
          type: "post",
          item: post as unknown as T,
          viewedAt,
        } satisfies GenericRecentItem<T>;
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

        const response =
          apiEndpoint === "recents/perfumes"
            ? await meApi.recents.perfumes.sync(
                itemsToSync.map((i) => String(i.id))
              )
            : await meApi.recents.posts.sync(
                itemsToSync.map((i) => String(i.id))
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
  }, [
    items,
    lastSyncedAt,
    setLastSyncedAt,
    setItems,
    apiEndpoint,
    syncInterval,
    enabled,
  ]);
}
