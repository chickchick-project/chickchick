import React from "react";
import { CollectionSection } from "@/components/domains/user/sections";
import { fetchUserCollections } from "@/components/domains/user/user.helper";
import { notFound } from "next/navigation";
import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import { getUserById } from "@/lib/utils/getUserProfile";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;
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

  const initialCollectionData = await fetchUserCollections(pageOwnerId);

  return (
    <CollectionSection
      initialCollectionData={initialCollectionData.data}
      user={user}
    />
  );
}
