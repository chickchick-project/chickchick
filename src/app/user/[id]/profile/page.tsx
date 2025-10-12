import { notFound } from "next/navigation";
import { ProfileSection } from "@/components/domains/user/sections";
import { getUserById } from "@/lib/utils/getUserProfile";
import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import { getUserSessionInfo } from "@/lib/utils/getUserSessionInfo";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;

  const { isMe } = await getUserSessionInfo(pageOwnerId);

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

  if (!isMe) {
    return notFound();
  }

  return <ProfileSection />;
}
