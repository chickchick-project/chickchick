"use client";
import { usePathname } from "next/navigation";

export const BodyWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className={isHome ? "" : "max-w-[1200px] mx-auto"}>{children}</div>
  );
};
