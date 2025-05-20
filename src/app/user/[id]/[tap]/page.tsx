import { redirect } from "next/navigation";
import UserFooter from "@/components/domains/user/layouts/UserFooter";
import UserHeader from "@/components/domains/user/layouts/UserHeader";
import PageClient from "@/components/domains/user/PageClient";
import { TabData } from "@/components/domains/user/sections/sections.type";
import {
  fetchMockActivityData,
  fetchMockBookmarksData,
  fetchMockCollectionData,
} from "@/lib/mocks/fetchUser";
import { users } from "@prisma/client";
import { getSession } from "@/lib/database/getSession";
import { fetchUserById } from "@/lib/supabase/query/user";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string; tap: string }>;
}) {
  const { tap, id } = await params; //pageowner id
  const session = await getSession(); //user id
  let user: users | null = null;
  try {
    user = await fetchUserById(id);
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error(
      "사용자 정보를 가져오는데 실패했습니다. 잠시 후 다시 시도해주세요."
    );
  }

  if (!user) {
    return redirect("/");
  }

  let tabData: TabData;

  if (tap === "collection") {
    tabData = { tap, data: await fetchMockCollectionData(id) };
  } else if (tap === "bookmarks") {
    tabData = { tap, data: await fetchMockBookmarksData(id) };
  } else if (tap === "activity") {
    tabData = { tap, data: await fetchMockActivityData(id) };
  } else {
    tabData = { tap: "profile", data: user };
  }

  const isMe = session?.user?.id === id;
  return (
    <>
      <UserHeader user={user} />
      <PageClient pageOwner={user} isMe={isMe} {...tabData} />
      {tap !== "profile" && <UserFooter />}
    </>
  );
}
