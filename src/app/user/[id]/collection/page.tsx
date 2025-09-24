import type { User } from "@prisma/client";
import { notFound } from "next/navigation";
import { fetchUserById } from "@/lib/queries/userQueries";
import { CollectionSection } from "@/components/domains/user/sections";

const USER_REGEX = /^[0-9a-fA-F-]{36}$/;

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;

  let user: User | null = null;
  try {
    const userResult = await fetchUserById(pageOwnerId);
    if (!userResult.success || !userResult.data) {
      return notFound();
    }
    user = userResult.data;
    if (typeof user.id !== "string" || !USER_REGEX.test(user.id)) {
      return notFound();
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return notFound();
  }

  return <CollectionSection pageOwner={user} />;
}