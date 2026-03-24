"use client";

import { useMediaQuery } from "@/client/hooks/useMediaQuery";
import { RecentPostsSection } from "./components/RecentPostsSection";
import { RecentPerfumesSection } from "./components/RecentPerfumesSection";

const UserFooter = () => {
  const isTabletOrLarger = useMediaQuery("(min-width: 768px)");

  if (isTabletOrLarger === undefined) {
    return null;
  }

  return (
    <div className="flex flex-col gap-y-16 py-[60px]">
      <RecentPostsSection isTabletOrLarger={isTabletOrLarger} />
      <RecentPerfumesSection isTabletOrLarger={isTabletOrLarger} />
    </div>
  );
};

export default UserFooter;
