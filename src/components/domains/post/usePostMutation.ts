import {
  CreatePostInput,
  UpdatePostInput,
} from "@/lib/hono/schemas/community.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { editPostById, submitNewPost } from "./post.helpers";
import { deletePostById } from "../postDetail/postDetail.helpers";
import { PostCategory } from "@prisma/client";

export default function usePostMutation(postId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const postQueryKey = ["post", postId];

  const invalidatePost = () =>
    queryClient.invalidateQueries({ queryKey: postQueryKey });
  const invalidateAllCommunityQueries = () =>
    queryClient.invalidateQueries({ queryKey: ["community"] });
  const invalidateAffectedPostLists = (category: PostCategory) => {
    queryClient.invalidateQueries({ queryKey: ["community", category] });
    queryClient.invalidateQueries({
      queryKey: ["community", "BEST"],
    });
  };

  const createMutation = useMutation({
    mutationFn: (newPost: CreatePostInput) => submitNewPost(newPost),
    onSuccess: (newPostData) => {
      invalidateAffectedPostLists(newPostData.category);
      router.push(`/community/post/${newPostData.id}`);
    },
    onError: (error) => console.error(error, error.message),
  });

  const editMutation = useMutation({
    mutationFn: (updatedPost: UpdatePostInput) =>
      editPostById(postId!, updatedPost),
    onSuccess: () => {
      invalidatePost();
      invalidateAllCommunityQueries();
      router.push(`/community/post/${postId}`);
    },
    onError: (error) => console.error(error, error.message),
  });
  const deleteMutation = useMutation({
    mutationFn: () => deletePostById(postId!),
    onSuccess: (data) => {
      invalidateAffectedPostLists(data.category);
      router.push(`/community?tab=${data.category}`);
    },
    onError: (error) => console.error(error, error.message),
  });

  return { createMutation, editMutation, deleteMutation };
}
