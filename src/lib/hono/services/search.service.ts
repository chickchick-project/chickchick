import { supabase } from "@/lib/supabase/init";
import type {
  SearchGetQuery,
  SearchPostBody,
  PaginatedSearchResponse,
  SupabasePerfume,
} from "../schemas/search.schema";
import type { ApiPerfumeSimpleResponse } from "../schemas/perfume.schema";
import {
  serviceInternalError,
  ServiceResult,
  serviceSuccess,
} from "../utils/service.utils";

function transformSupabasePerfume(
  p: SupabasePerfume,
): ApiPerfumeSimpleResponse {
  return {
    id: p.perfume_id,
    nameEn: p.perfume_name_en,
    nameKo: p.perfume_name_ko,
    brand: {
      nameEn: p.brand_name_en,
      nameKo: p.brand_name_ko,
      brandUrl: p.brand_url,
    },
    perfumeImage: {
      imageUrl: p.image_url,
    },
  };
}

// 필터 처리 함수
function processFilters(params: SearchGetQuery | SearchPostBody) {
  const hasFilters =
    "brandFilter" in params ||
    "notesFilter" in params ||
    "accordsFilter" in params;

  if (!hasFilters) {
    return {
      brandFilter: null,
      notesFilter: null,
      accordsFilter: null,
    };
  }

  const postParams = params as SearchPostBody;

  // 배열이 존재하고 비어있지 않은 경우에만 전달
  const brandFilter =
    postParams.brandFilter && postParams.brandFilter.length > 0
      ? postParams.brandFilter
      : null;
  const notesFilter =
    postParams.notesFilter && postParams.notesFilter.length > 0
      ? postParams.notesFilter
      : null;
  const accordsFilter =
    postParams.accordsFilter && postParams.accordsFilter.length > 0
      ? postParams.accordsFilter
      : null;

  return {
    brandFilter,
    notesFilter,
    accordsFilter,
  };
}

export async function searchPerfumesService(
  params: SearchGetQuery | SearchPostBody,
): Promise<ServiceResult<PaginatedSearchResponse>> {
  try {
    const limit = params.limit ?? 15;
    const fetchLimit = limit + 1;

    // 복합 커서 파싱 (형식: "{priority}:{perfume_id}")
    const [lastPriority, lastId] = params.cursor
      ? params.cursor.split(":")
      : [null, null];

    // 필터 처리
    const { brandFilter, notesFilter, accordsFilter } = processFilters(params);

    // Supabase RPC 함수가 예상하는 형태로 변환
    const rpcParams = {
      search_text: params.searchText || null,
      brand_filter: brandFilter,
      notes_filter: notesFilter,
      accords_filter: accordsFilter,
      last_seen_id: lastId ?? null,
      last_seen_priority: lastPriority ? Number(lastPriority) : null,
      result_limit: fetchLimit,
    };

    const rpcParamsTotal = {
      search_text: params.searchText || null,
      brand_filter: brandFilter,
      notes_filter: notesFilter,
      accords_filter: accordsFilter,
    };

    const [perfumesResult, totalResult] = await Promise.all([
      supabase.rpc("search_perfumes", rpcParams),
      supabase.rpc("search_perfumes_total", rpcParamsTotal),
    ]);

    if (perfumesResult.error) {
      console.error("Perfumes search error:", perfumesResult.error);
      throw perfumesResult.error;
    }
    if (totalResult.error) {
      console.error("Total count error:", totalResult.error);
      throw totalResult.error;
    }

    const rawData: SupabasePerfume[] = perfumesResult.data || [];
    const totalCount: number = totalResult.data || 0;

    const hasMore = rawData.length > limit;
    const slicedRaw = hasMore ? rawData.slice(0, limit) : rawData;
    const lastItem = slicedRaw[slicedRaw.length - 1];
    const nextCursor =
      hasMore && lastItem
        ? `${lastItem.priority}:${lastItem.perfume_id.toLowerCase()}`
        : null;

    return serviceSuccess({
      data: slicedRaw.map(transformSupabasePerfume),
      totalCount,
      nextCursor,
    });
  } catch (error) {
    return serviceInternalError(error);
  }
}
