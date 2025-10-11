import UserFooter from "@/components/domains/user/layouts/UserFooter";
import UserHeader from "@/components/domains/user/layouts/UserHeader";
import { getSession } from "@/lib/database/getSession";
import PageClient from "@/components/domains/user/PageClient";
import { getUserById } from "@/lib/utils/getUserProfile";
import { notFound } from "next/navigation";
import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function UserLayout({ children, params }: LayoutProps) {
  const { id: pageOwnerId } = await params;

  const session = await getSession();

  const isMe = session?.user?.id === pageOwnerId;
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

  return (
    <div className="w-[1200px] mx-auto my-10">
      <UserHeader user={user} />
      <PageClient pageOwnerId={pageOwnerId} isMe={isMe}>
        {children}
      </PageClient>
      <UserFooter />
    </div>
  );
}
