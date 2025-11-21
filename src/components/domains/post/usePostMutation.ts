import {
  CreatePostInput,
  UpdatePostInput,
} from "@/lib/hono/schemas/community.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { editPostById, submitNewPost } from "./post.helpers";
import { deletePostById } from "../postDetail/postDetail.helpers";
import { queryKeys } from "@/lib/utils/queryKeys";

export default function usePostMutation(postId?: string) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const postQueryKey = queryKeys.community.post(postId!);

  const invalidatePost = () =>
    queryClient.invalidateQueries({ queryKey: postQueryKey });
  const invalidateAllCommunityQueries = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.community.lists() });
  // const invalidateAffectedPostLists = (category: PostCategory) => {
  //   queryClient.invalidateQueries({ queryKey: queryKeys.community.posts({ filters: { category } }) });
  //   queryClient.invalidateQueries({
  //     queryKey: ["community", "BEST"],
  //   });
  // };

  const createMutation = useMutation({
    mutationFn: (newPost: CreatePostInput) => submitNewPost(newPost),
    onSuccess: (newPostData) => {
      invalidateAllCommunityQueries();
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
      invalidateAllCommunityQueries();
      router.push(`/community?tab=${data.category}`);
    },
    onError: (error) => console.error(error, error.message),
  });

  return { createMutation, editMutation, deleteMutation };
}
