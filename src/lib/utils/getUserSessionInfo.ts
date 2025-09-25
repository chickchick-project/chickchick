import { getSession } from "@/lib/database/getSession";

export async function getUserSessionInfo(pageOwnerId: string) {
  const session = await getSession();
  const isMe = session?.user?.id === pageOwnerId;

  return { session, isMe };
}
