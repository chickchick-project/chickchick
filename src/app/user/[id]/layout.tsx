import { notFound } from "next/navigation";
import UserFooter from "@/components/domains/user/layouts/UserFooter";
import UserHeader from "@/components/domains/user/layouts/UserHeader";
import PageClient from "@/components/domains/user/PageClient";
import { User } from "@prisma/client";
import { getSession } from "@/lib/database/getSession";
import { fetchUserById } from "@/lib/queries/userQueries";

const USER_REGEX = /^[0-9a-fA-F-]{36}$/;

interface LayoutProps {
  children: React.ReactNode;
  collection: React.ReactNode;
  bookmarks: React.ReactNode;
  activity: React.ReactNode;
  profile: React.ReactNode;
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}

export default async function UserLayout({
  children,
  collection,
  bookmarks,
  activity,
  profile,
  params,
  searchParams,
}: LayoutProps) {
  const { id: pageOwnerId } = await params;
  const searchParamsData = await searchParams;
  const tab = searchParamsData?.tab || "collection";
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
      <PageClient pageOwner={user} isMe={isMe} tap={tab}>
        {children}
        {collection}
        {bookmarks}
        {activity}
        {profile}
      </PageClient>
      {tab !== "profile" && <UserFooter />}
    </div>
  );
}