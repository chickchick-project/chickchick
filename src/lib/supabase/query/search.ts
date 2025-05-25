import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase/init";

interface SearchParams {
  search_text: string;
  result_limit?: number;
  last_seen_id?: string;
}

interface SearchParamsWithFilters extends SearchParams {
  brand_filter: string;
  notes_filter: string[];
  accords_filter: string[];
}

export async function fetchSearch(params: SearchParams) {
  const { search_text, result_limit = 15, last_seen_id } = params;

  const rpcParams = {
    p_search_text: search_text,
    p_brand_filter: null,
    p_notes_filter: null,
    p_accords_filter: null,
    p_last_seen_id: last_seen_id || null,
    p_result_limit: result_limit,
  };

  const rpcParamsTotal = {
    p_search_text: search_text,
    p_brand_filter: null,
    p_notes_filter: null,
    p_accords_filter: null,
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
    console.error("Supabase RPC Error in fetchSearch:", error);
    throw new Error(`Database RPC failed: ${(error as Error).message}`);
  }
}

export async function fetchSearchWithFilters(params: SearchParamsWithFilters) {
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
    p_search_text: search_text,
    p_brand_filter: formattedBrandFilter,
    p_notes_filter: formattedNotes,
    p_accords_filter: formattedAccords,
    p_last_seen_id: last_seen_id || null,
    p_result_limit: result_limit ?? 15,
  };

  const rpcParamsTotal = {
    p_search_text: search_text,
    p_brand_filter: formattedBrandFilter,
    p_notes_filter: formattedNotes,
    p_accords_filter: formattedAccords,
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

export async function checkPerfumeExists(perfumeId: string) {
  const perfume = await prisma.perfume.findUnique({
    where: { id: perfumeId },
    select: { id: true },
  });
  return Boolean(perfume);
}
