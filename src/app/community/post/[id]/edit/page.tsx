import PageClient from "@/components/domains/post/PageClient";
import { getPostDetailById } from "@/components/domains/postDetail/postDetail.helpers";
import { getSession } from "@/lib/database/getSession";
import getQueryClient from "@/lib/hono/utils/getQueryClient";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();

  // if (!session) {
  //   return <div>로그인이 필요한 서비스 입니다.</div>; //로그인 하지 않은경우 로그인 모달띄우기
  // }

  const cookieStore = await cookies();
  const requestHeaders = {
    Cookie: cookieStore.toString(),
  };
  const queryClient = getQueryClient();

  const post = await queryClient.fetchQuery({
    queryKey: ["post", id],
    queryFn: () => getPostDetailById(id, requestHeaders),
  });

  if (!post || post.author.id !== session?.user?.id) {
    return notFound();
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <PageClient type="edit" postId={id} />
    </HydrationBoundary>
  );
}
