import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/hono/utils/getQueryClient";
import { getUserById } from "@/lib/utils/getUserProfile";
import UserLayoutClient from "@/components/domains/user/UserLayoutClient";
import { getUserSessionInfo } from "@/lib/utils/getUserSessionInfo";
import { notFound } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function UserLayout({ children, params }: LayoutProps) {
  const { id: pageOwnerId } = await params;
  const queryClient = getQueryClient();
  const { isMe } = await getUserSessionInfo(pageOwnerId);

  try {
    await queryClient.prefetchQuery({
      queryKey: ["user", "profile", pageOwnerId],
      queryFn: () => getUserById(pageOwnerId),
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserLayoutClient pageOwnerId={pageOwnerId} isMe={isMe}>
        {children}
      </UserLayoutClient>
    </HydrationBoundary>
  );
}
