"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import NavBar from ".";

//NavBar로 전달된 클라이언트 설정 및 상태를 담은 Wrapper
export default function NavBarWrapper() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const currentPath = usePathname();

  const onLogin = () => {
    setIsLoggedIn((prev) => !prev);
  };

  return (
    <NavBar
      currentPath={currentPath}
      isLoggedIn={isLoggedIn}
      onLogin={onLogin}
    />
  );
}
