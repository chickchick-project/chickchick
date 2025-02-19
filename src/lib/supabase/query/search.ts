import { supabase } from "@/lib/supabase/init";

/**
 * 향수 검색 함수
 */
export async function fetchSearch(searchTerm: string, limit: number = 15) {
  const { data, error } = await supabase.rpc("search_perfumes", {
    search_text: searchTerm,
    result_limit: limit,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
