import type { User } from "@prisma/client";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/database/getSession";
import { fetchUserById } from "@/lib/queries/userQueries";
import { fetchUserBookmarksPerfumes } from "@/components/domains/user/user.helper";
import { BookmarkSection } from "@/components/domains/user/sections";

const USER_REGEX = /^[0-9a-fA-F-]{36}$/;

export default async function BookmarksPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id: pageOwnerId } = await params;
  const searchParamsData = await searchParams;
  const tab = searchParamsData?.tab || "collection";

  if (tab !== "bookmarks") {
    return null;
  }

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

  let transformedData = [];
  try {
    const response = await fetchUserBookmarksPerfumes(pageOwnerId);
      transformedData = response.data.map((perfume) => ({
        id: perfume.id,
        nameEn: perfume.nameEn,
        nameKo: perfume.nameKo,
        brand: perfume.brand,
        perfumeImage: perfume.perfumeImage,
      }));
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    transformedData = [];
  }

  return (
    <BookmarkSection
      isMe={isMe}
      userId={pageOwnerId}
      initialPerfumeData={transformedData}
    />
  );
}