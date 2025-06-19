import { Perfume } from "@/app/api/search/route";
import { fetchPerfumes } from "@/lib/utils/fetchPerfumes";
import { FILTER_LABELS } from "./filter/filter.constants";

const getLabel = (key: string) =>
  FILTER_LABELS[key as keyof typeof FILTER_LABELS] || key;

const adaptedFetchPerfumes = async (
  cursor: string | null,
  searchText: string,
  filters: Map<string, Set<string>>
) => {
  try {
    const result = await fetchPerfumes(cursor, searchText, filters);
    return {
      data: result.data || [],
      nextCursor: result.nextCursor ?? null,
      totalCount: result.totalCount,
    };
  } catch (error) {
    console.error("adaptedFetchPerfumes 오류:", error);
    return { data: [], nextCursor: null };
  }
};

const createQueryKey = (keyword: string, filters: Map<string, Set<string>>) => {
  const searchParams = new URLSearchParams();
  searchParams.append("q", keyword);
  filters.forEach((values, key) => {
    values.forEach((value) => searchParams.append(key, value));
  });
  return searchParams.toString();
};

const getUniquePerfumes = (perfumes: Perfume[]): Perfume[] => {
  const perfumeMap = new Map<string, Perfume>();

  perfumes.forEach((item) => {
    const existing = perfumeMap.get(item.perfume_id);
    if (
      existing?.priority &&
      item.priority &&
      (!existing || existing.priority < item.priority)
    ) {
      perfumeMap.set(item.perfume_id, item);
    }
  });

  return Array.from(perfumeMap.values());
};

export { getLabel, adaptedFetchPerfumes, createQueryKey, getUniquePerfumes };
