import { supabase } from "@/lib/supabase/init";

/**
 * 향수 데이터 타입 정의
 */
interface Perfume {
  perfume_id: string;
  perfume_name: Record<string, string>;
  brand_id: string;
  brand_name: Record<string, string>;
  image_url?: string;
  created_at: string;
}

/**
 * OFFSET 기반 향수 페이지네이션 함수
 */
export const fetchPerfumesWithPagination = async (
  page: number = 1,
  limit: number = 15
): Promise<{
  perfumes: Perfume[];
  pagination: {
    currentPage: number;
    nextPage: number | null;
    prevPage: number | null;
  };
}> => {
  // OFFSET 계산
  const offset = (page - 1) * limit;

  // Supabase에서 데이터 가져오기
  const { data, error } = await supabase.rpc("get_perfumes_with_brands", {
    limit_param: limit,
    offset_param: offset,
  });

  if (error) {
    throw new Error(error.message);
  }

  const perfumes: Perfume[] = (data ?? []).map((p: Perfume) => ({
    id: p.perfume_id,
    name: p.perfume_name as Record<string, string>,
    image_url: p.image_url,
    created_at: p.created_at ?? undefined,
    brand: {
      id: p.brand_id,
      name: p.brand_name as Record<string, string>,
    },
  }));

  return {
    perfumes,
    pagination: {
      currentPage: page,
      nextPage: perfumes.length === limit ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
  };
};
