import { cookies } from "next/headers";
import PageClient from "@/components/domains/postDetail/PageClient";
import getQueryClient from "@/lib/utils/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeys } from "@/lib/utils/queryKeys";
import { commentApi } from "@/lib/utils/api/comment.api";
import { communityApi } from "@/lib/utils/api/community.api";
import type { Metadata } from "next";
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
    console.error("메타데이터 생성 중 오류 발생:", error);
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
      queryKey: [...queryKeys.community.comments(id), "infinite"],
      queryFn: ({ pageParam }) =>
        commentApi.listWithCursor(id, {
          cursor: pageParam ?? undefined,
          limit: 7,
        }),
      initialPageParam: null as string | null,
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PageClient postId={id} />
    </HydrationBoundary>
  );
}
