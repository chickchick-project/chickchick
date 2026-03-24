import { getSession } from "@/server/database/getSession";

export async function getUserSessionInfo(pageOwnerId: string) {
  const session = await getSession();
  const isMe = session?.user?.id === pageOwnerId;

  return { session, isMe };
}
