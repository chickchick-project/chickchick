"use client";
import { Suspense } from "react";
import { usePathname } from "next/navigation";
import {
  SkeletonBookmark,
  SkeletonMasonry,
} from "@/components/domains/user/sections/Skeleton";

function TabSkeletonSelector({ tab }: { tab: string }) {
  switch (tab) {
    case "collection":
      return <SkeletonMasonry />;
    case "bookmarks":
      return <SkeletonBookmark />;
    default:
      return <SkeletonBookmark />;
  }
}

export default function UserLayoutSuspense({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const activeTab = pathSegments.length > 2 ? pathSegments[2] : "collection";
  return (
    <Suspense fallback={<TabSkeletonSelector tab={activeTab} />}>
      {children}
    </Suspense>
  );
}
