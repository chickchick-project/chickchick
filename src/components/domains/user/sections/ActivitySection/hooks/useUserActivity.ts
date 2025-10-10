import { useSuspenseQuery } from "@tanstack/react-query";
import {
  fetchUserComments,
  fetchUserLikedPerfumes,
  fetchUserLikedPosts,
  fetchUserPosts,
  fetchUserReviews,
} from "../../../user.helper";
import { PaginatedApiReviewResponse } from "@/lib/hono/schemas/review.schema";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";
import { MyComment } from "@/lib/hono/services/me.service";

export const useUserReview = (initialData?: PaginatedApiReviewResponse) => {
  const queryResult = useSuspenseQuery<PaginatedApiReviewResponse>({
    queryKey: ["user", "reviews", "me"],
    queryFn: fetchUserReviews,
    initialData,
  });

  return queryResult;
};

export const useUserPost = (initialData?: PostCardProps[]) => {
  const queryResult = useSuspenseQuery<PostCardProps[]>({
    queryKey: ["user", "posts", "me"],
    queryFn: async () => (await fetchUserPosts()).data,

    initialData,
  });

  return queryResult;
};

export const useUserComment = (initialData?: MyComment[]) => {
  const queryResult = useSuspenseQuery<MyComment[]>({
    queryKey: ["user", "comments", "me"],
    queryFn: async () => (await fetchUserComments()).data,
    initialData,
  });

  return queryResult;
};

export const useUserLikedPerfume = (
  initialData?: ApiPerfumeSimpleResponse[]
) => {
  const queryResult = useSuspenseQuery<ApiPerfumeSimpleResponse[]>({
    queryKey: ["user", "liked-perfumes", "me"],
    queryFn: async () => (await fetchUserLikedPerfumes()).data,
    initialData,
  });

  return queryResult;
};

export const useUserLikedPost = (initialData?: PostCardProps[]) => {
  const queryResult = useSuspenseQuery<PostCardProps[]>({
    queryKey: ["user", "liked-posts", "me"],
    queryFn: async () => (await fetchUserLikedPosts()).data,
    initialData,
  });

  return queryResult;
};
