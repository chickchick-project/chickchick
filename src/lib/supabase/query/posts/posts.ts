import { supabase } from "@/lib/supabase/init";

export async function fetchPosts({
  searchInput = "",
  order = "created_at",
  limit = 10,
  offset = 0,
}) {
  let query = supabase
    .from("posts")
    .select("*")
    .order(order, { ascending: false })
    .range(offset, offset + limit - 1);

  if (searchInput) {
    query = query.or(
      `title.ilike.%${searchInput}%,content.ilike.%${searchInput}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function fetchPostById(postId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }

  return data;
}

export async function createPost(postData: {
  title: string;
  content: string;
  user_id: string;
  category: string;
  thumbnail_url?: string;
}) {
  const { data, error } = await supabase.from("posts").insert({
    ...postData,
  });
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  return data;
}
