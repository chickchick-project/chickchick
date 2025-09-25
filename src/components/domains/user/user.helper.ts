import { UserCollection } from "@prisma/client";
// import { createApiServerClient } from "@/lib/utils/core-request/serverClient";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { createHttpClient } from "@/lib/utils/core-request";
import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";

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

export async function fetchUserBookmarksPosts() {
  const bookmarks = await apiClient.get<PostCardProps[]>(`/me/bookmarks/posts`);
  return { ...bookmarks } as { data: PostCardProps[] };
}
