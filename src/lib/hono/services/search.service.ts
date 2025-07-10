import { supabase } from "@/lib/supabase/init";
import { prisma } from "@/lib/prisma";
import {
  GetSearchParams,
  PostSearchParams,
} from "@/lib/hono/schemas/search.schema";

interface SearchPerfume {
  perfume_id: string;
  perfume_name_en: string;
  perfume_name_ko: string;
  brand_id: string;
  brand_name_en: string;
  brand_name_ko: string;
  image_url: string;
  priority: number;
}

async function fetchSearch(params: {
  search_text: string;
  last_seen_id: string | null;
  result_limit: number;
}) {
  const { search_text, result_limit, last_seen_id } = params;

  const rpcParams = {
    search_text,
    brand_filter: null,
    notes_filter: null,
    accords_filter: null,
    last_seen_id: last_seen_id || null,
    result_limit,
  };

  const rpcParamsTotal = {
    search_text,
    brand_filter: null,
    notes_filter: null,
    accords_filter: null,
  };

  const [perfumesResult, totalResult] = await Promise.all([
    supabase.rpc("search_perfumes", rpcParams),
    supabase.rpc("search_perfumes_total", rpcParamsTotal),
  ]);

  if (perfumesResult.error) throw perfumesResult.error;
  if (totalResult.error) throw totalResult.error;

  return [perfumesResult.data, totalResult.data];
}

async function fetchSearchWithFilters(
  params: PostSearchParams & { result_limit: number }
) {
  const {
    search_text,
    brand_filter,
    notes_filter,
    accords_filter,
    last_seen_id,
    result_limit,
  } = params;

  const formattedNotes =
    Array.isArray(notes_filter) && notes_filter.length > 0
      ? notes_filter
      : null;
  const formattedAccords =
    Array.isArray(accords_filter) && accords_filter.length > 0
      ? accords_filter
      : null;
  const formattedBrandFilter = brand_filter ? [brand_filter] : null;

  const rpcParams = {
    search_text: search_text,
    brand_filter: formattedBrandFilter,
    notes_filter: formattedNotes,
    accords_filter: formattedAccords,
    last_seen_id: last_seen_id || null,
    result_limit: result_limit ?? 15,
  };

  const rpcParamsTotal = {
    search_text: search_text,
    brand_filter: formattedBrandFilter,
    notes_filter: formattedNotes,
    accords_filter: formattedAccords,
  };

  try {
    const [perfumesResult, totalResult] = await Promise.all([
      supabase.rpc("search_perfumes", rpcParams),
      supabase.rpc("search_perfumes_total", rpcParamsTotal),
    ]);

    if (perfumesResult.error) throw perfumesResult.error;
    if (totalResult.error) throw totalResult.error;

    return [perfumesResult.data, totalResult.data];
  } catch (error) {
    console.error("Supabase RPC Error in fetchSearchWithFilters:", error);
    throw new Error(`Database RPC failed: ${(error as Error).message}`);
  }
}

export async function checkPerfumeExistsService(
  perfumeId: string
): Promise<boolean> {
  const perfume = await prisma.perfume.findUnique({
    where: { id: perfumeId },
    select: { id: true },
  });
  return Boolean(perfume);
}

export async function getPaginatedPerfumesService(
  params: GetSearchParams | PostSearchParams
) {
  const isPost = "search_text" in params;
  const search_text = isPost
    ? (params as PostSearchParams).search_text || ""
    : (params as GetSearchParams).q || "";

  const result_limit = isPost
    ? (params as PostSearchParams).result_limit || 15
    : (params as GetSearchParams).limit || 15;

  const last_seen_id = isPost
    ? (params as PostSearchParams).last_seen_id
    : (params as GetSearchParams).cursor || null;

  const fetchLimit = result_limit + 1;

  const [rawData, total] = isPost
    ? await fetchSearchWithFilters({
        ...(params as PostSearchParams),
        result_limit: fetchLimit,
      })
    : await fetchSearch({
        search_text,
        last_seen_id,
        result_limit: fetchLimit,
      });

  // 데이터가 없는 경우 즉시 빈 결과 반환
  if (!rawData || rawData.length === 0) {
    return { data: [], nextCursor: null, totalCount: 0 };
  }

  const transformedPerfumes = rawData.map((p: SearchPerfume) => ({
    id: p.perfume_id,
    nameEn: p.perfume_name_en,
    nameKo: p.perfume_name_ko,
    brandId: p.brand_id,
    brandNameEn: p.brand_name_en,
    brandNameKo: p.brand_name_ko,
    imageUrl: p.image_url,
    priority: p.priority,
  }));

  const hasMore = transformedPerfumes.length > result_limit;
  const perfumesToReturn = hasMore
    ? transformedPerfumes.slice(0, result_limit)
    : transformedPerfumes;

  const nextCursor = hasMore
    ? perfumesToReturn[perfumesToReturn.length - 1].id
    : null;

  const totalCount = typeof total === "number" ? total : 0;

  return {
    data: perfumesToReturn,
    nextCursor,
    totalCount,
  };
}
