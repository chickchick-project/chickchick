import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/client/utils/getQueryClient";
import { userApi } from "@/client/utils/api/users.api";
import UserLayoutClient from "@/components/domains/user/UserLayoutClient";
import { getUserSessionInfo } from "@/shared/utils/getUserSessionInfo";
import { queryKeys } from "@/client/utils/queryKeys";
import { generateSeo } from "@/shared/utils/generateSeo";
import type { Metadata } from "next";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: pageOwnerId } = await params;

  try {
    const userResponse = await userApi.getById(pageOwnerId);
    if (!userResponse || !userResponse.data) {
      return generateSeo({
        title: "사용자 없음",
        description: "존재하지 않는 사용자입니다.",
      });
    }

    const user = userResponse.data;
    const userName = user.nickname || "사용자";

    return generateSeo({
      title: `${userName}의 프로필`,
      description: `${userName}님의 향수 컬렉션과 리뷰를 확인하세요. ChickChick에서 다양한 향수 정보를 공유합니다.`,
      image: user.imageUrl || undefined,
    });
  } catch (error) {
    console.error("메타데이터 생성 중 오류 발생:", error);
    return generateSeo({
      title: "사용자 프로필",
      description: "ChickChick 사용자 프로필 페이지입니다.",
    });
  }
}

export default async function UserLayout({ children, params }: LayoutProps) {
  const { id: pageOwnerId } = await params;
  const queryClient = getQueryClient();
  const { isMe } = await getUserSessionInfo(pageOwnerId);

  await queryClient.prefetchQuery({
    queryKey: queryKeys.user.profile(pageOwnerId),
    queryFn: () => userApi.getById(pageOwnerId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserLayoutClient pageOwnerId={pageOwnerId} isMe={isMe}>
        {children}
      </UserLayoutClient>
    </HydrationBoundary>
  );
}
