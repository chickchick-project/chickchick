"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserNotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <h1 className="text-2xl font-bold text-gray-800">
        요청하신 페이지는 존재하지 않습니다.
      </h1>
      <p className="text-gray-600">요청하신 페이지는 존재하지 않습니다.</p>
      <p className="text-sm text-gray-500">
        {countdown}초 후 메인 페이지로 이동합니다...
      </p>
    </div>
  );
}
