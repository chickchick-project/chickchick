"use client";

import UserHeaderSkeleton from "./components/UserHeaderSkeleton";
import UserHeaderDisplay from "./components/UserHeaderDisplay";
import { useUserStore } from "@/client/stores/useUserStore";
import type { ApiMyProfileResponse } from "@/server/hono/schemas/me.schema";

const UserHeader = ({ user }: { user: ApiMyProfileResponse }) => {
  const { isLoading } = useUserStore();

  if (!user || isLoading) {
    return <UserHeaderSkeleton />;
  }

  return <UserHeaderDisplay user={user} />;
};

export default UserHeader;
