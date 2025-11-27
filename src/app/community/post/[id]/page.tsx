import { cookies } from "next/headers";
import PageClient from "@/components/domains/postDetail/PageClient";
import { getCommentsByPostId } from "@/components/domains/postDetail/commentSection/comment.helper";
import getQueryClient from "@/lib/utils/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/lib/utils/queryKeys";
import { communityApi } from "@/lib/utils/api/community.api";
import { Metadata } from "next";
import { generateSeo } from "@/lib/utils/generateSeo";
type Props = {
  params: Promise<{ id: string }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const post = await communityApi.getById(id);
    if (!post || !post.data) {
      return generateSeo({
        title: "게시글 없음",
        description: "존재하지 않거나 삭제된 게시글입니다.",
      });
    }
    return generateSeo({
      title: post.data.title,
      description: post.data.contentText,
      image: post.data.thumbnailUrl,
    });
  } catch (error) {
    return generateSeo({
      title: "커뮤니티",
      description: "chickchick 커뮤니티 페이지입니다.",
    });
  }
}
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
