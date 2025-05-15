import UserFooter from "@/components/domains/user/layouts/UserFooter";
import UserHeader from "@/components/domains/user/layouts/UserHeader";
import PageClient from "@/components/domains/user/PageClient";
import { TabData } from "@/components/domains/user/sections/sections.type";
import { mockFetchAllMyPageData } from "@/lib/mocks/fetchUser";
import { MOCK_USER_INFO } from "@/components/commons/navBar/navBar.constants";
import { redirect } from "next/navigation";

export default async function MePage({
  params,
}: {
  params: Promise<{ id: string; tap: string }>;
}) {
  const { tap, id } = await params;

  const isMe = MOCK_USER_INFO.id === "test-user2";
  console.log(isMe);
  const restrictedTapsForOthers = ["activity", "profile"];

  if (!isMe && restrictedTapsForOthers.includes(tap)) {
    redirect(`/user/${id}/collection`);
  }

  const allData = await mockFetchAllMyPageData();

  let tabData: TabData;

  if (tap === "collection") {
    tabData = { tap, data: allData.collection };
  } else if (tap === "bookmarks") {
    tabData = { tap, data: allData.bookmarks };
  } else if (tap === "activity") {
    tabData = { tap, data: allData.activity };
  } else {
    tabData = { tap: "profile", data: allData.profile };
  }

  return (
    <>
      <UserHeader />
      <PageClient isMe={isMe} selectedUser={MOCK_USER_INFO} {...tabData} />
      {tap !== "profile" && <UserFooter />}
    </>
  );
}
