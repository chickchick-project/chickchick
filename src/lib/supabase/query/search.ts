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

/**
 * 단순 검색 함수 (GET 요청)
 */
export async function fetchSearch(params: SearchParams) {
  const { search_text, result_limit, last_seen_id } = params;

  const { data, error } = await supabase.rpc("search_perfumes", {
    search_text,
    result_limit,
    last_seen_id,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * 필터 포함 검색 함수 (POST 요청)
 */
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

  const { data, error } = await supabase.rpc("search_perfumes", {
    search_text,
    brand_filter,
    notes_filter: formattedNotes,
    accords_filter: formattedAccords,
    last_seen_id,
    result_limit,
  });

  if (error) {
    console.error("Supabase RPC Error:", error);
    throw new Error(`Supabase RPC Error: ${error.message}`);
  }

  if (data === null) {
    console.error("Supabase RPC returned null data");
    throw new Error("Supabase RPC returned null data");
  }

  return data;
}

/**
 * last_seen_id가 실제로 존재하는지 확인하는 함수
 */
export async function checkPerfumeExists(perfumeId: string) {
  const { data, error } = await supabase
    .from("perfumes")
    .select("id")
    .eq("id", perfumeId)
    .single();

  if (error) {
    return false;
  }

  return Boolean(data);
}
