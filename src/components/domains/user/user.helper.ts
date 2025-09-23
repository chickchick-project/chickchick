import { PostBookmark, UserCollection } from "@prisma/client";
// import { createApiServerClient } from "@/lib/utils/core-request/serverClient";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { createHttpClient } from "@/lib/utils/core-request";

const apiClient = createHttpClient({
  baseUrl:
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1",
});

export async function fetchUserCollections(userId: string) {
  const collections = await apiClient.get<UserCollection[]>(
    `/users/${userId}/collections`
  );
  return { ...collections } as { data: UserCollection[] };
}

export async function fetchUserBookmarksPerfumes(userId: string) {
  const bookmarks = await apiClient.get<PerfumeBaseResponse[]>(
    `/users/${userId}/bookmarks/perfumes`
  );
  return { ...bookmarks } as { data: PerfumeBaseResponse[] };
}

export async function fetchUserBookmarksPosts(userId: string) {
  const bookmarks = await apiClient.get<PostBookmark[]>(
    `/users/${userId}/bookmarks/posts`
  );
  console.log("bookmarks", bookmarks);
  return { ...bookmarks } as { data: PostBookmark[] };
}
