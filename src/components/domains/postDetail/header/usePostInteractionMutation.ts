import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  toggleBookmarkedPostById,
  toggleLikedPostById,
} from "../postDetail.helpers";
import { ApiPostStatusResponse } from "@/lib/hono/schemas/community.schema";

export default function usePostInteractionMutation(postId: string) {
  const queryClient = useQueryClient();
  const postStatusQueryKey = ["post", postId, "status"];

  const invalidatePostStatus = () =>
    queryClient.invalidateQueries({ queryKey: postStatusQueryKey });

  const toggleLikeMutation = useMutation({
    mutationFn: () => toggleLikedPostById(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postStatusQueryKey });
      const previousStatus =
        queryClient.getQueryData<ApiPostStatusResponse>(postStatusQueryKey);
      queryClient.setQueryData<ApiPostStatusResponse>(
        postStatusQueryKey,
        (oldStatus) => {
          if (!oldStatus) return oldStatus;
          return { ...oldStatus, isLiked: !oldStatus.isLiked };
        }
      );
      return { previousStatus };
    },
    onError: (error, _, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(postStatusQueryKey, context.previousStatus);
      }
      console.error(error, error.message);
    },
    onSettled: () => {
      invalidatePostStatus();
    },
  });

  const toggleBookmarkMutation = useMutation({
    mutationFn: () => toggleBookmarkedPostById(postId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: postStatusQueryKey });
      const previousStatus =
        queryClient.getQueryData<ApiPostStatusResponse>(postStatusQueryKey);
      queryClient.setQueryData<ApiPostStatusResponse>(
        postStatusQueryKey,
        (oldStatus) => {
          if (!oldStatus) return oldStatus;
          return { ...oldStatus, isBookmarked: !oldStatus.isBookmarked };
        }
      );
      return { previousStatus };
    },
    onError: (error, _, context) => {
      if (context?.previousStatus) {
        queryClient.setQueryData(postStatusQueryKey, context.previousStatus);
      }
      console.error(error, error.message);
    },
    onSettled: () => {
      invalidatePostStatus();
    },
  });

  return { toggleLikeMutation, toggleBookmarkMutation };
}
