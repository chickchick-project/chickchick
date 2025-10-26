import { useSuspenseQuery } from "@tanstack/react-query";
import { meApi } from "@/lib/utils/api/users.api";
import { queryKeys } from "@/lib/utils/queryKeys";

export const useUserReview = () => {
  const queryResult = useSuspenseQuery({
    queryKey: queryKeys.user.reviews("me"),
    queryFn: async () => {
      const response = await meApi.reviews();
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch reviews");
      }
      return response.data;
    },
  });

  return queryResult;
};

export const useUserPost = () => {
  const queryResult = useSuspenseQuery({
    queryKey: queryKeys.user.posts("me"),
    queryFn: async () => {
      const response = await meApi.posts();
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch posts");
      }
      return response.data;
    },
  });

  return queryResult;
};

export const useUserComment = () => {
  const queryResult = useSuspenseQuery({
    queryKey: queryKeys.user.comments("me"),
    queryFn: async () => {
      const response = await meApi.comments();
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch comments");
      }
      return response.data;
    },
  });

  return queryResult;
};

export const useUserLikedPerfume = () => {
  const queryResult = useSuspenseQuery({
    queryKey: queryKeys.user.likes.perfumes("me"),
    queryFn: async () => {
      const response = await meApi.likes.perfumes();
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch liked perfumes");
      }
      return response.data;
    },
  });

  return queryResult;
};

export const useUserLikedPost = () => {
  const queryResult = useSuspenseQuery({
    queryKey: queryKeys.user.likes.posts("me"),
    queryFn: async () => {
      const response = await meApi.likes.posts();
      if (!response || !response.success) {
        throw new Error(response?.message || "Failed to fetch liked posts");
      }
      return response.data;
    },
  });

  return queryResult;
};
