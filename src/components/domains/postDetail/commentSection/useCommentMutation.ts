import { CreateCommentBody } from "@/lib/hono/schemas/comment.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNewComment, deleteCommentById } from "./comment.helper";

export default function useCommentMutation(postId: string) {
  const queryClient = useQueryClient();
  const invalidateComments = () =>
    queryClient.invalidateQueries({ queryKey: ["post", postId, "comments"] });
  const invalidatePostStatus = () =>
    queryClient.invalidateQueries({ queryKey: ["post", postId, "status"] });

  const uploadMutation = useMutation({
    mutationFn: (commentData: CreateCommentBody) =>
      createNewComment(postId, commentData),
    onSuccess: () => {
      invalidateComments();
      invalidatePostStatus();
    },
    onError: (error) => console.error(error, error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => deleteCommentById(commentId),
    onSuccess: () => {
      invalidateComments();
      invalidatePostStatus();
    },
    onError: (error) => console.error(error, error.message),
  });

  return { uploadMutation, deleteMutation };
}
