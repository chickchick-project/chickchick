"use server";

import { getSession } from "@/lib/database/getSession";
import { supabase } from "@/lib/supabase/init";

/**
 * 현재 로그인한 사용자 정보 가져오기
 */
export async function fetchUserInfo() {
  const session = await getSession();
  if (!session?.user?.id) return;

  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session?.user?.id)
    .single();

  if (error) {
    throw error;
  }

  return userData;
}

/**
 * 사용자 향수 컬렉션 조회
 */
export async function fetchUserCollection(userId: string) {
  const { data, error } = await supabase
    .from("user_collections")
    .select("perfume_id, perfumes(name, image_url)")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data;
}

/**
 * 향수 컬렉션에 추가
 */
export async function addUserCollection(userId: string, perfumeId: string) {
  const { error } = await supabase.from("user_collections").insert({
    user_id: userId,
    perfume_id: perfumeId,
  });

  if (error) throw new Error(error.message);
  return { message: "향수가 컬렉션에 추가되었습니다." };
}

/**
 * 사용자 북마크 목록 조회
 */
export async function fetchUserBookmarks(userId: string) {
  const { data, error } = await supabase
    .from("user_bookmarks")
    .select("item_id, item_type")
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return data;
}

/**
 * 북마크 추가
 */
export async function addUserBookmark(
  userId: string,
  itemId: string,
  itemType: string
) {
  const { error } = await supabase.from("user_bookmarks").insert({
    user_id: userId,
    item_id: itemId,
    item_type: itemType,
  });

  if (error) throw new Error(error.message);
  return { message: "북마크가 추가되었습니다." };
}
