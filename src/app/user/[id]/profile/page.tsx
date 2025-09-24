import { notFound } from "next/navigation";
import { getSession } from "@/lib/database/getSession";
import { fetchUserById } from "@/lib/queries/userQueries";
import { ProfileSection } from "@/components/domains/user/sections";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;

  const session = await getSession();
  const isMe = session?.user?.id === pageOwnerId;

  if (!isMe) {
    return notFound();
  }

  const userResult = await fetchUserById(pageOwnerId);
  if (!userResult.success || !userResult.data) {
    return notFound();
  }
  const user = userResult.data;

  return <ProfileSection data={user} />;
}