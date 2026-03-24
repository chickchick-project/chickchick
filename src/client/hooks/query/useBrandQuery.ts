import { brandApi } from "@/client/utils/api/brands.api";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/client/utils/queryKeys";

// 특정 브랜드 상세 조회 (ID)
const useBrandDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.brand.detail(id),
    queryFn: () => brandApi.getById(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

// 특정 브랜드 상세 조회 (한글 이름)
const useBrandDetailByName = (nameKo: string) => {
  return useQuery({
    queryKey: queryKeys.brand.byName(nameKo),
    queryFn: () => brandApi.getByName(nameKo),
    enabled: !!nameKo,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

export { useBrandDetail, useBrandDetailByName };
