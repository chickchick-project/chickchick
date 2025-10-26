import { BookmarkSection } from "@/components/domains/user/sections";
import { getUserSessionInfo } from "@/lib/utils/getUserSessionInfo";

export default async function BookmarksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;

  const { isMe } = await getUserSessionInfo(pageOwnerId);

  return <BookmarkSection isMe={isMe} userId={pageOwnerId} />;
}
