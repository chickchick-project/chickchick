import PageClient from "@/components/domains/post/PageClient";
import { communityApi } from "@/client/utils/api/community.api";
import getQueryClient from "@/client/utils/getQueryClient";
import { queryKeys } from "@/client/utils/queryKeys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

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

  const post = await queryClient.fetchQuery({
    queryKey: queryKeys.community.post(id),
    queryFn: () => communityApi.getById(id, requestHeaders),
  });

  if (!post || !post.data.isAuthor) {
    return notFound();
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PageClient type="edit" postId={id} />
    </HydrationBoundary>
  );
}
