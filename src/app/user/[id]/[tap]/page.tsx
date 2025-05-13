import UserFooter from "@/components/domains/user/layouts/Footer";
import UserHeader from "@/components/domains/user/layouts/Header";
import PageClient from "@/components/domains/user/PageClient";
import { TabData } from "@/components/domains/user/sections/type";
import { mockFetchAllMyPageData } from "@/lib/utils/fetchUser";
import { MOCK_USER_INFO } from "@/components/commons/navBar/navBar.constants";

export default async function MePage({
  params,
}: {
  params: Promise<{ id: string; tap: string }>;
}) {
  const { tap } = await params;

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

  const isMe = MOCK_USER_INFO.id === "test-user2";

  return (
    <>
      <UserHeader />
      <PageClient isMe={isMe} selectedUser={MOCK_USER_INFO} {...tabData} />
      {tap !== "profile" && <UserFooter />}
    </>
  );
}
