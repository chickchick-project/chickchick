import { notFound } from "next/navigation";
import { ActivitySection } from "@/components/domains/user/sections";
import { getSession } from "@/lib/database/getSession";
import { getUserById } from "@/lib/utils/getUserProfile";
import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;

  const session = await getSession();
  const isMe = session?.user?.id === pageOwnerId;

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

  return <ActivitySection />;
}
