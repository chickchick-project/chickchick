import { supabase } from "@/lib/supabase/init";

/**
 * OFFSET 기반 향수 페이지네이션 데이터 조회
 */
export async function fetchPerfumesWithPagination(
  page: number = 1,
  limit: number = 15
) {
  const offset = (page - 1) * limit;

  const { data, error } = await supabase.rpc("get_perfumes_with_brands", {
    limit_param: limit,
    offset_param: offset,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * 특정 향수 상세 정보 조회
 */
export async function fetchPerfumeDetails(perfumeId: string) {
  const { data, error } = await supabase.rpc("get_perfume_details", {
    perfume_uuid: perfumeId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * main 페이지 배너에 표시할 향수 데이터 조회
 */
// TODO: main 페이지 배너 주제에 맞는 필터 적용 필요
export async function fetchPerfumesWithBanner(
  page: number = 1,
  limit: number = 5
) {
  const offset = (page - 1) * limit;

  const { data, error } = await supabase.rpc("get_perfumes_with_brands", {
    limit_param: limit,
    offset_param: offset,
  });

  if (error) {
    // TODO: 향수 데이터 채워지면 error 처리 필요
    // throw new Error(error.message);

    return [];
  }

  return data;
}
