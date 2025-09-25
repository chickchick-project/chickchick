import { cookies } from "next/headers";
import {
  getPostDetailById,
  getPostDetailStatusById,
} from "@/components/domains/postDetail/postDetail.helpers";
import PageClient from "@/components/domains/postDetail/PageClient";
import { getCommentsByPostId } from "@/components/domains/postDetail/commentSection/comment.helper";
import getQueryClient from "@/lib/hono/utils/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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
      queryKey: ["post", id],
      queryFn: () => getPostDetailById(id, requestHeaders),
    }),
    queryClient.prefetchQuery({
      queryKey: ["post", id, "status"],
      queryFn: () => getPostDetailStatusById(id, requestHeaders),
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
