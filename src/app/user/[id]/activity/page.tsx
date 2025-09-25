import { notFound } from "next/navigation";
import { fetchMockActivityData } from "@/lib/mocks/fetchUser";
import { ActivitySection } from "@/components/domains/user/sections";
import { getUserSessionInfo } from "@/lib/utils/getUserSessionInfo";

export default async function ActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;

  const { isMe } = await getUserSessionInfo(pageOwnerId);

  if (!isMe) {
    return notFound();
  }

  const data = await fetchMockActivityData(pageOwnerId);
  return <ActivitySection data={data} />;
}
