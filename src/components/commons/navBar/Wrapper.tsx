"use client";

import { usePathname } from "next/navigation";
import NavBar from ".";

export default function NavBarWrapper() {
  const currentPath = usePathname();

  return (
    <>
      <NavBar currentPath={currentPath} />
    </>
  );
}
