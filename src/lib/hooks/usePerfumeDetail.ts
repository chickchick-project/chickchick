import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../utils/queryKeys";
import { perfumeApi } from "../utils/api/perfumes.api";

export const usePerfumeDetail = (perfumeId: string) => {
  return useQuery({
    queryKey: queryKeys.perfume.detail(perfumeId),
    queryFn: () => perfumeApi.detail(perfumeId),
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};
