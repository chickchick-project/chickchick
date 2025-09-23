import { PostBookmark, UserCollection } from "@prisma/client";
import { createApiServerClient } from "@/lib/utils/core-request/serverClient";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";

export async function fetchUserCollections(userId: string) {
  const serverApi = await createApiServerClient();
  const collections = await serverApi.get<UserCollection[]>(
    `/users/${userId}/collections`
  );
  return { ...collections } as { data: UserCollection[] };
}

export async function fetchUserBookmarksPerfumes(userId: string) {
  const serverApi = await createApiServerClient();
  const bookmarks = await serverApi.get<PerfumeBaseResponse[]>(
    `/users/${userId}/bookmarks/perfumes`
  );
  return { ...bookmarks } as { data: PerfumeBaseResponse[] };
}

export async function fetchUserBookmarksPosts(userId: string) {
  const serverApi = await createApiServerClient();
  const bookmarks = await serverApi.get<PostBookmark[]>(
    `/users/${userId}/bookmarks/posts`
  );
  console.log("bookmarks", bookmarks);
  return { ...bookmarks } as { data: PostBookmark[] };
}
