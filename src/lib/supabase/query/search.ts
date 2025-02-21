import { supabase } from "@/lib/supabase/init";

/**
 * 향수 검색 함수
 */
export async function fetchSearch(
  searchTerm: string,
  limit: number = 15,
  lastId?: string
) {
  const { data, error } = await supabase.rpc("search_perfumes", {
    search_text: searchTerm,
    result_limit: limit + 1,
    last_seen_id: lastId ?? null,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

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
