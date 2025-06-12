import { notFound } from "next/navigation";
import UserFooter from "@/components/domains/user/layouts/UserFooter";
import UserHeader from "@/components/domains/user/layouts/UserHeader";
import PageClient from "@/components/domains/user/PageClient";
import { TabData } from "@/components/domains/user/sections/sections.type";
import { TAB_CONFIGS } from "@/components/domains/user/tabs/tabs.helper";
import {
  fetchMockActivityData,
  fetchMockBookmarksData,
  fetchMockCollectionData,
} from "@/lib/mocks/fetchUser";
import { User } from "@prisma/client";
import { getSession } from "@/lib/database/getSession";
import { fetchUserById } from "@/lib/queries/userQueries";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string; tap: string }>;
}) {
  const { tap, id: pageOwnerId } = await params; //pageowner id
  const session = await getSession(); //user id
  let user: User | null = null;
  try {
    user = await fetchUserById(pageOwnerId);
    if (
      !user ||
      typeof user.id !== "string" ||
      !/^[0-9a-fA-F-]{36}$/.test(user.id)
    ) {
      return notFound();
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return notFound();
  }

  let tabData: TabData;

  if (tap === "collection") {
    tabData = { tap, data: await fetchMockCollectionData(pageOwnerId) };
  } else if (tap === "bookmarks") {
    tabData = { tap, data: await fetchMockBookmarksData(pageOwnerId) };
  } else if (tap === "activity") {
    tabData = { tap, data: await fetchMockActivityData(pageOwnerId) };
  } else {
    tabData = { tap: "profile", data: user };
  }

  const isMe = session?.user?.id === pageOwnerId;
  const requestedTabConfig = TAB_CONFIGS.find((config) => config.value === tap);

  if (requestedTabConfig?.isMeOnly && !isMe) {
    return notFound();
  }
  return (
    <>
      <UserHeader user={user} />
      <PageClient pageOwner={user} isMe={isMe} {...tabData} />
      {tap !== "profile" && <UserFooter />}
    </>
  );
}
