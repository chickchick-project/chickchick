import { BookmarkSection } from "@/components/domains/user/sections";
import { fetchUserBookmarksPerfumes } from "@/components/domains/user/user.helper";
import { getUserSessionInfo } from "@/lib/utils/getUserSessionInfo";

export default async function BookmarksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;

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
