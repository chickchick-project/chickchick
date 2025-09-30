import { useQuery } from "@tanstack/react-query";
import {
  fetchUserComments,
  fetchUserLikedPerfumes,
  fetchUserLikedPosts,
  fetchUserPosts,
  fetchUserReviews,
} from "../../../user.helper";
import { ReviewResponse } from "@/lib/hono/schemas/review.schema";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { PostCardProps } from "@/components/commons/card/postCard/postCard.types";

export const useUserReview = (initialData?: ReviewResponse[]) => {
  const queryResult = useQuery<ReviewResponse[]>({
    queryKey: ["user", "reviews", "me"],
    queryFn: async () => await fetchUserReviews(),
    initialData,
  });

  return queryResult;
};

export const useUserPost = (initialData?: PostCardProps[]) => {
  const queryResult = useQuery<PostCardProps[]>({
    queryKey: ["user", "posts", "me"],
    queryFn: async () => (await fetchUserPosts()).data,
    initialData,
  });

  return queryResult;
};

export const useUserComment = (initialData?: PostCardProps[]) => {
  const queryResult = useQuery<PostCardProps[]>({
    queryKey: ["user", "comments", "me"],
    queryFn: async () => (await fetchUserComments()).data,
    initialData,
  });

  return queryResult;
};

export const useUserLikedPerfume = (initialData?: PerfumeBaseResponse[]) => {
  const queryResult = useQuery<PerfumeBaseResponse[]>({
    queryKey: ["user", "liked-perfumes", "me"],
    queryFn: async () => (await fetchUserLikedPerfumes()).data,
    initialData,
  });

  return queryResult;
};

export const useUserLikedPost = (initialData?: PostCardProps[]) => {
  const queryResult = useQuery<PostCardProps[]>({
    queryKey: ["user", "liked-posts", "me"],
    queryFn: async () => (await fetchUserLikedPosts()).data,
    initialData,
  });

  return queryResult;
};
