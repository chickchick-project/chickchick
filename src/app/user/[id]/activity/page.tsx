import { notFound } from "next/navigation";
import { getSession } from "@/lib/database/getSession";
import { fetchMockActivityData } from "@/lib/mocks/fetchUser";
import { ActivitySection } from "@/components/domains/user/sections";

export default async function ActivityPage({
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

  const data = await fetchMockActivityData(pageOwnerId);
  return <ActivitySection data={data} />;
}
