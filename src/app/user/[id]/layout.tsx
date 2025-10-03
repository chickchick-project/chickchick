import { notFound } from "next/navigation";
import UserFooter from "@/components/domains/user/layouts/UserFooter";
import UserHeader from "@/components/domains/user/layouts/UserHeader";
import PageClient from "@/components/domains/user/PageClient";
import { getSession } from "@/lib/database/getSession";
import { fetchUserById } from "@/lib/queries/userQueries";
import { User } from "@zod/modelSchema";

const USER_REGEX = /^[0-9a-fA-F-]{36}$/;

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export default async function UserLayout({ children, params }: LayoutProps) {
  const { id: pageOwnerId } = await params;

  const session = await getSession();
  let user: User | null = null;
  try {
    const userResult = await fetchUserById(pageOwnerId);
    if (!userResult.success || !userResult.data) {
      return notFound();
    }
    user = userResult.data;
    if (typeof user.id !== "string" || !USER_REGEX.test(user.id)) {
      return notFound();
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return notFound();
  }

  const isMe = session?.user?.id === pageOwnerId;

  return (
    <div className="w-[1200px] mx-auto my-10">
      <UserHeader user={user} />
      <PageClient pageOwner={user} isMe={isMe}>
        {children}
      </PageClient>
      <UserFooter />
    </div>
  );
}
