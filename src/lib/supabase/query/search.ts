import { supabase } from "@/lib/supabase/init";

export async function fetchSearch(searchTerm: string, limit: number = 15) {
  const { data, error } = await supabase.rpc("search_perfumes", {
    search_text: searchTerm.replace(/\s+/g, " & "),
    result_limit: limit,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
