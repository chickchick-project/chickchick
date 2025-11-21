import { cookies } from "next/headers";
import PageClient from "@/components/domains/postDetail/PageClient";
import { getCommentsByPostId } from "@/components/domains/postDetail/commentSection/comment.helper";
import getQueryClient from "@/lib/utils/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/lib/utils/queryKeys";
import { communityApi } from "@/lib/utils/api/community.api";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cookieStore = await cookies();

  const requestHeaders = {
    Cookie: cookieStore.toString(),
  };

  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.community.post(id),
      queryFn: () => communityApi.getById(id, requestHeaders),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.community.postStatus(id),
      queryFn: () => communityApi.getStatus(id, requestHeaders),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.community.postCategoryPosts(id),
      queryFn: () => communityApi.getCategoryPosts(id),
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: ["post", id, "comments"],
      queryFn: () => getCommentsByPostId(id),
      initialPageParam: null,
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PageClient postId={id} />
    </HydrationBoundary>
  );
}
