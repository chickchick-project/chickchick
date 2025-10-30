import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/utils/getQueryClient";
import { userApi } from "@/lib/utils/api/users.api";
import UserLayoutClient from "@/components/domains/user/UserLayoutClient";
import { getUserSessionInfo } from "@/lib/utils/getUserSessionInfo";
import { queryKeys } from "@/lib/utils/queryKeys";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
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
