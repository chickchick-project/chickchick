import { supabase } from "@/lib/supabase/init";
import type {
  SearchGetQuery,
  SearchPostBody,
  PaginatedSearchResponse,
} from "../schemas/search.schema";
import type { PerfumeBaseResponse } from "../schemas/perfume.schema";
import {
  serviceInternalError,
  ServiceResult,
  serviceSuccess,
} from "../utils/serviceResult.utils";
import { createCursorPaginationResult } from "../utils/pagination";

interface SupabasePerfume {
  perfume_id: string;
  perfume_name_en: string;
  perfume_name_ko: string;
  brand_name_en: string;
  brand_name_ko: string;
  image_url: string;
}

function transformSupabasePerfume(p: SupabasePerfume): PerfumeBaseResponse {
  return {
    id: p.perfume_id,
    nameEn: p.perfume_name_en,
    nameKo: p.perfume_name_ko,
    brand: {
      nameEn: p.brand_name_en,
      nameKo: p.brand_name_ko,
    },
    perfumeImage: {
      imageUrl: p.image_url,
    },
  };
}

// 필터 처리 함수
function processFilters(params: SearchGetQuery | SearchPostBody) {
  const isPost = "searchText" in params;

  if (!isPost) {
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

  console.log("원본 필터 값들:", {
    brandFilter: postParams.brandFilter,
    notesFilter: postParams.notesFilter,
    accordsFilter: postParams.accordsFilter,
  });

  console.log("처리된 필터 값들:", {
    brandFilter,
    notesFilter,
    accordsFilter,
  });

  return {
    brandFilter,
    notesFilter,
    accordsFilter,
  };
}

export async function searchPerfumesService(
  params: SearchGetQuery | SearchPostBody
): Promise<ServiceResult<PaginatedSearchResponse>> {
  try {
    const isPost = "searchText" in params;
    const searchText = isPost ? params.searchText : params.q;
    const limit = params.limit ?? 15;
    const cursor = params.cursor;
    const fetchLimit = limit + 1;

    // 필터 처리
    const { brandFilter, notesFilter, accordsFilter } = processFilters(params);

    // Supabase RPC 함수가 예상하는 형태로 변환
    const rpcParams = {
      search_text: searchText || "",
      brand_filter: brandFilter,
      notes_filter: notesFilter,
      accords_filter: accordsFilter,
      last_seen_id: cursor ?? null,
      result_limit: fetchLimit,
    };

    const rpcParamsTotal = {
      search_text: searchText || "",
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

    // console.log(`Found ${rawData.length} perfumes, total: ${totalCount}`);

    const transformedData = rawData.map(transformSupabasePerfume);
    const paginatedResult = createCursorPaginationResult(
      transformedData,
      totalCount,
      limit
    );

    return serviceSuccess({
      data: paginatedResult.data,
      totalCount: paginatedResult.totalCount,
      nextCursor: paginatedResult.nextCursor,
    });
  } catch (error) {
    console.error("Search service error:", error);
    return serviceInternalError(error);
  }
}
