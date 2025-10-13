import UserFooter from "@/components/domains/user/layouts/UserFooter";
import UserHeader from "@/components/domains/user/layouts/UserHeader";
import PageClient from "@/components/domains/user/PageClient";
import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import { getUserById } from "@/lib/utils/getUserProfile";
import { getUserSessionInfo } from "@/lib/utils/getUserSessionInfo";
import { notFound } from "next/navigation";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function UserLayout({ children, params }: LayoutProps) {
  const { id: pageOwnerId } = await params;

  const { isMe } = await getUserSessionInfo(pageOwnerId);
  let user: ApiMyProfileResponse | null;

  try {
    user = await getUserById(pageOwnerId);
    if (!user) {
      return notFound();
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return notFound();
  }

  if (!isMe) {
    return notFound();
  }

  return (
    <div className="max-w-[1200px] mx-auto my-10">
      <UserHeader user={user} />
      <PageClient isMe={isMe}>{children}</PageClient>
      <UserFooter />
    </div>
  );
}
