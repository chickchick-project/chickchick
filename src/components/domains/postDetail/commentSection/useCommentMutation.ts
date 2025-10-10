import {
  CreateCommentBody,
  UpdateCommentBody,
} from "@/lib/hono/schemas/comment.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewComment,
  deleteCommentById,
  editCommentById,
} from "./comment.helper";
import { CommentsQueryData, updateCommentInCache } from "./comment.mutators";

export default function useCommentMutation(postId: string) {
  const queryClient = useQueryClient();
  const commentsQueryKey = ["post", postId, "comments"];
  const statusQueryKey = ["post", postId, "status"];
  const invalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: commentsQueryKey });
  const invalidatePostStatus = () =>
    queryClient.invalidateQueries({ queryKey: statusQueryKey });

  const uploadMutation = useMutation({
    mutationFn: (commentData: CreateCommentBody) =>
      createNewComment(postId, commentData),
    onSuccess: () => {
      invalidateComments();
      invalidatePostStatus();
    },
    onError: (error) => console.error(error, error.message),
  });

  const editMutation = useMutation({
    mutationFn: ({
      commentId,
      commentData,
    }: {
      commentId: string;
      commentData: UpdateCommentBody;
    }) => editCommentById(commentId, commentData),

    onMutate: async ({ commentId, commentData }) => {
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });
      const previousCommentsData =
        queryClient.getQueryData<CommentsQueryData>(commentsQueryKey);
      queryClient.setQueryData<CommentsQueryData>(
        commentsQueryKey,
        (oldData) => {
          if (!oldData) return oldData;
          return updateCommentInCache(oldData, commentId, commentData);
        }
      );
      return { previousCommentsData };
    },
    onError: (error, _, context) => {
      if (context?.previousCommentsData) {
        queryClient.setQueryData(
          commentsQueryKey,
          context.previousCommentsData
        );
      }
      console.error(error, error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: commentsQueryKey });
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteCommentById(commentId),
    onSuccess: () => {
      invalidateComments();
      invalidatePostStatus();
    },
    onError: (error) => console.error(error, error.message),
  });

  return { uploadMutation, editMutation, deleteMutation };
}
