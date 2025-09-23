import { notFound } from "next/navigation";
import UserFooter from "@/components/domains/user/layouts/UserFooter";
import UserHeader from "@/components/domains/user/layouts/UserHeader";
import PageClient from "@/components/domains/user/PageClient";
import { TAB_CONFIGS } from "@/components/domains/user/tabs/tabs.helper";

import { User } from "@prisma/client";
import { getSession } from "@/lib/database/getSession";
import { fetchUserById } from "@/lib/queries/userQueries";
import TabContentLoader from "@/components/domains/user/tabs/TabLoader/ContentLoader";

const USER_REGEX = /^[0-9a-fA-F-]{36}$/;

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string; tap: string }>;
}) {
  const { tap, id: pageOwnerId } = await params; //pageowner id
  const session = await getSession(); //user id
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
  const requestedTabConfig = TAB_CONFIGS.find((config) => config.value === tap);

  if (requestedTabConfig?.isMeOnly && !isMe) {
    return notFound();
  }
  return (
    <>
      <UserHeader user={user} />
      <PageClient pageOwner={user} isMe={isMe} tap={tap}>
        <TabContentLoader tap={tap} pageOwner={user} isMe={isMe} />
      </PageClient>
      {tap !== "profile" && <UserFooter />}
    </>
  );
}
