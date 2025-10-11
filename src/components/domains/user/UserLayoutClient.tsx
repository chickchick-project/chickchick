"use client";

import UserHeader from "@/components/domains/user/layouts/UserHeader";
import UserFooter from "@/components/domains/user/layouts/UserFooter";
import PageClient from "@/components/domains/user/PageClient";
import { useUserProfileById } from "@/lib/hooks/useUserProfile";
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
    <div className="w-[1200px] mx-auto my-10">
      <UserHeader user={user} />
      <PageClient pageOwnerId={pageOwnerId} isMe={isMe}>
        {children}
      </PageClient>
      <UserFooter />
    </div>
  );
}
