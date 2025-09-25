import { getSession } from "@/lib/database/getSession";
import { BookmarkSection } from "@/components/domains/user/sections";
import { fetchUserBookmarksPerfumes } from "@/components/domains/user/user.helper";

export default async function BookmarksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;

  const session = await getSession();
  const isMe = session?.user?.id === pageOwnerId;

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
