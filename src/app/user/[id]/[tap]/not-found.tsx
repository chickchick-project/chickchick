"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-[600px]">
      <span>존재하지 않는 페이지이거나, 잘못된 접근입니다.</span>
      <span className="mt-2">잠시 후 메인 페이지로 돌아갑니다.</span>
    </div>
  );
}
export default NotFound;
