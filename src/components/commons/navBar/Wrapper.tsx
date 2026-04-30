"use client";

import { usePathname } from "next/navigation";
import NavBar from ".";

// NavBar는 Server Component이므로 직접 import 후 렌더링하면 client bundle에 포함된다.
// currentPath는 client에서만 알 수 있으므로 NavBarWrapper가 client 경계를 담당한다.
// NavBar 자체는 서버 데이터를 사용하지 않으므로 현재 구조는 유지하되,
// Wrapper에서 router.refresh()를 통해 계정 전환 시 서버 컴포넌트를 동기화한다.
export const NavBarWrapper = () => {
  const currentPath = usePathname();

  return <NavBar currentPath={currentPath} />;
};
