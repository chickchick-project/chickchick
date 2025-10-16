import {
  CreatePostInput,
  UpdatePostInput,
} from "@/lib/hono/schemas/community.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { editPostById, submitNewPost } from "./post.helpers";

export default function usePostMutation(postId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const postQueryKey = ["post", postId];

  const invalidatePost = () =>
    queryClient.invalidateQueries({ queryKey: postQueryKey });

  const createMutation = useMutation({
    mutationFn: (newPost: CreatePostInput) => submitNewPost(newPost),
    onSuccess: (newPostData) => {
      const categoryOfNewPost = newPostData.data.category;
      queryClient.invalidateQueries({
        queryKey: ["community", categoryOfNewPost],
      });
      router.push(`/community/post/${newPostData.data.id}`);
    },
    onError: (error) => console.error(error, error.message),
  });

  const editMutation = useMutation({
    mutationFn: (updatedPost: UpdatePostInput) =>
      editPostById(postId!, updatedPost),
    onSuccess: (data) => {
      invalidatePost();
      router.push(`/community/post/${postId}`);
    },
    onError: (error) => console.error(error, error.message),
  });

  return { createMutation, editMutation };
}
