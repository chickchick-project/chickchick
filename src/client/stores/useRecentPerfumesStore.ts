import { createRecentItemsStore } from "./createRecentItemsStore";
import type { GenericRecentItem } from "./createRecentItemsStore";

type RecentPerfumeData = {
  id: string;
  perfumeName: string;
  brandName: string;
  imageUrl: string;
};

export type RecentPerfumeItem = GenericRecentItem<RecentPerfumeData>;

const MAX_RECENT_PERFUMES = 10;

export const useRecentPerfumesStore = createRecentItemsStore<RecentPerfumeData>(
  {
    name: "recent-perfumes",
    maxItems: MAX_RECENT_PERFUMES,
    type: "perfume",
  }
);
