import { brandApi } from "@/lib/utils/api/brands.api";
import { useQuery } from "@tanstack/react-query";

// 모든 브랜드 목록 조회
const useBrandList = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => brandApi.list(),
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

// 특정 브랜드 상세 조회 (ID)
const useBrandDetail = (id: string) => {
  return useQuery({
    queryKey: ["brands", id],
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
    queryKey: ["brands", "name", nameKo],
    queryFn: () => brandApi.getByName(nameKo),
    enabled: !!nameKo,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

export { useBrandList, useBrandDetail, useBrandDetailByName };
