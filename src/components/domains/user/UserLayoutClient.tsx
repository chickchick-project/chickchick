"use client";

import UserHeader from "@/components/domains/user/sections/ProfileHeaderSection";
import UserFooter from "@/components/domains/user/sections/RecentViewSection";
import PageClient from "@/components/domains/user/PageClient";
import { useUserProfileById } from "@/client/hooks/query/useUserQuery";
import { notFound } from "next/navigation";

interface UserLayoutClientProps {
  children: React.ReactNode;
  pageOwnerId: string;
  isMe: boolean;
}

export default function UserLayoutClient({
  children,
  pageOwnerId,
  isMe,
}: UserLayoutClientProps) {
  const { data: user, isError } = useUserProfileById(pageOwnerId);

  if (isError || !user) {
    return notFound();
  }

  return (
    <div className="max-w-[1200px] w-full mx-auto my-10">
      <UserHeader user={user} />
      <PageClient pageOwnerId={pageOwnerId} isMe={isMe}>
        {children}
      </PageClient>
      <UserFooter />
    </div>
  );
}
