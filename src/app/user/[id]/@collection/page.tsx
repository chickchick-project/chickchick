import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { User } from "@prisma/client";
import { notFound } from "next/navigation";
import { fetchUserById } from "@/lib/queries/userQueries";
import { fetchUserCollections } from "@/components/domains/user/user.helper";
import { CollectionSection } from "@/components/domains/user/sections";

const USER_REGEX = /^[0-9a-fA-F-]{36}$/;

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id: pageOwnerId } = await params;
  const searchParamsData = await searchParams;
  const tab = searchParamsData?.tab || "collection";

  if (tab !== "collection") {
    return null;
  }

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

  const queryClient = new QueryClient();

  try {
    await queryClient.prefetchQuery({
      queryKey: ["collections", pageOwnerId],
      queryFn: () => fetchUserCollections(pageOwnerId),
    });
  } catch (error) {
    console.error("Error prefetching collection data:", error);
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <CollectionSection pageOwner={user} />
    </HydrationBoundary>
  );
}
