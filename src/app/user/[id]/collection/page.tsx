import React from "react";
import { CollectionSection } from "@/components/domains/user/sections";

export default async function UserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: pageOwnerId } = await params;

  return <CollectionSection userId={pageOwnerId} />;
}
