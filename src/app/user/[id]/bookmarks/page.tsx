import { BookmarkSection } from "@/components/domains/user/sections";
import { fetchUserBookmarksPerfumes } from "@/components/domains/user/user.helper";
import { getUserSessionInfo } from "@/lib/utils/getUserSessionInfo";
import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import { getUserById } from "@/lib/utils/getUserProfile";
import { notFound } from "next/navigation";

export default async function BookmarksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;
  let user: ApiMyProfileResponse | null;

  try {
    user = await getUserById(pageOwnerId);
    if (!user) {
      return notFound();
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return notFound();
  }
  const { isMe } = await getUserSessionInfo(pageOwnerId);

  const initialPerfume = !isMe
    ? await fetchUserBookmarksPerfumes(pageOwnerId)
    : null;

  return (
    <BookmarkSection
      isMe={isMe}
      userId={pageOwnerId}
      initialPerfumeData={initialPerfume?.data}
    />
  );
}
