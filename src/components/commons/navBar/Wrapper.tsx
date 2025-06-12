"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import NavBar from ".";
import { useUserStore } from "@/lib/stores/useUserStore";

export default function NavBarWrapper() {
  const currentPath = usePathname();

  useEffect(() => {
    const { user, fetchUser, isLoading } = useUserStore.getState();
    if (!user) {
      fetchUser();
    } else {
      if (isLoading) {
        useUserStore.setState({ isLoading: false });
      }
    }
  }, []);

  return (
    <>
      <NavBar currentPath={currentPath} />
    </>
  );
}
