import { useQuery } from "@tanstack/react-query";
import { commentApi } from "../../utils/api/comment.api";
import { queryKeys } from "../../utils/queryKeys";
import { GetCommentQuery } from "@/lib/hono/schemas/comment.schema";

// 댓글 목록 조회
export const useComments = (postId: string) => {
  return useQuery({
    queryKey: queryKeys.community.comments(postId),
    queryFn: () => commentApi.list(postId),
    enabled: !!postId,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};

// 댓글 목록 조회 (커서 기반)
export const useCommentsWithCursor = (
  postId: string,
  params?: GetCommentQuery
) => {
  return useQuery({
    queryKey: [...queryKeys.community.comments(postId), "cursor", params],
    queryFn: () => commentApi.listWithCursor(postId, params),
    enabled: !!postId,
    select: (response) => {
      if (!response || !response.success) return null;
      return response.data;
    },
  });
};
