"use client";

import UserHeaderSkeleton from "./components/UserHeaderSkeleton";
import UserHeaderDisplay from "./components/UserHeaderDisplay";
import { useCurrentUser } from "@/client/hooks/useCurrentUser";
import type { ApiMyProfileResponse } from "@/server/hono/schemas/me.schema";

const UserHeader = ({ user }: { user: ApiMyProfileResponse }) => {
  const { isLoading } = useCurrentUser();

  if (!user || isLoading) {
    return <UserHeaderSkeleton />;
  }

  return <UserHeaderDisplay user={user} />;
};

export default UserHeader;
