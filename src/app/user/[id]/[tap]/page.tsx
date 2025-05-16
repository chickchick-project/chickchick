import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UserFooter from "@/components/domains/user/layouts/UserFooter";
import UserHeader from "@/components/domains/user/layouts/UserHeader";
import PageClient from "@/components/domains/user/PageClient";
import { TabData } from "@/components/domains/user/sections/sections.type";
import { mockFetchAllMyPageData } from "@/lib/mocks/fetchUser";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string; tap: string }>;
}) {
  const { tap, id } = await params;

  //To DO: 선택 한 유저의 활동 정보를 가져와야함.
  const allData = await mockFetchAllMyPageData(id);
  let tabData: TabData;

  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) {
    return redirect("/");
  }

  if (tap === "collection") {
    tabData = { tap, data: allData.collection };
  } else if (tap === "bookmarks") {
    tabData = { tap, data: allData.bookmarks };
  } else if (tap === "activity") {
    tabData = { tap, data: allData.activity };
  } else {
    tabData = { tap: "profile", data: user };
  }

  return (
    <>
      <UserHeader user={user} />
      <PageClient {...tabData} />
      {tap !== "profile" && <UserFooter />}
    </>
  );
}
