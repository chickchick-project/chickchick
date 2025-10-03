import { UserCollection } from "@prisma/client";
// import { createApiServerClient } from "@/lib/utils/core-request/serverClient";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";
import { createHttpClient } from "@/lib/utils/core-request";
import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";
import { PaginatedApiReviewResponse } from "@/lib/hono/schemas/review.schema";
// import { ApiSuccessResponse } from "@/lib/hono/utils/response.constants";

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
  const bookmarks = await apiClient.get<ApiPerfumeSimpleResponse[]>(
    `/users/${userId}/bookmarks/perfumes`
  );
  return { ...bookmarks } as { data: ApiPerfumeSimpleResponse[] };
}

export async function fetchUserBookmarksPosts() {
  const bookmarks = await apiClient.get<PostCardProps[]>(`/me/bookmarks/posts`);
  return { ...bookmarks } as { data: PostCardProps[] };
}

export async function fetchUserReviews(): Promise<PaginatedApiReviewResponse> {
  const reviews = await apiClient.get<PaginatedApiReviewResponse>(
    "/me/activity/reviews"
  );
  return reviews ?? { data: [], totalCount: 0, nextCursor: null };
}

export async function fetchUserPosts() {
  const posts = await apiClient.get<PostCardProps[]>(`/me/activity/posts`);
  return { ...posts } as { data: PostCardProps[] };
}

export async function fetchUserComments() {
  const comments = await apiClient.get<PostCardProps[]>(
    `/me/activity/comments`
  );
  return { ...comments } as { data: PostCardProps[] };
}

export async function fetchUserLikedPerfumes() {
  const likedPerfumes = await apiClient.get<ApiPerfumeSimpleResponse[]>(
    `/me/activity/liked-perfumes`
  );
  return { ...likedPerfumes } as { data: ApiPerfumeSimpleResponse[] };
}

export async function fetchUserLikedPosts() {
  const likedPosts = await apiClient.get<PostCardProps[]>(
    `/me/activity/liked-posts`
  );
  return { ...likedPosts } as { data: PostCardProps[] };
}
