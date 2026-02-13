"use client";

import UserHeaderSkeleton from "./components/UserHeaderSkeleton";
import UserHeaderDisplay from "./components/UserHeaderDisplay";
import { useUserStore } from "@/lib/stores/useUserStore";
import type { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";

const UserHeader = ({ user }: { user: ApiMyProfileResponse }) => {
  const isLoading = useUserStore((state) => state.isLoading);

  if (!user || isLoading) {
    return <UserHeaderSkeleton />;
  }

  return <UserHeaderDisplay user={user} />;
};

export default UserHeader;
