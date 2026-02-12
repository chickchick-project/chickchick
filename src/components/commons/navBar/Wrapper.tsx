"use client";

import { usePathname } from "next/navigation";
import NavBar from ".";

export const NavBarWrapper = () => {
  const currentPath = usePathname();

  return <NavBar currentPath={currentPath} />;
};
