"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import dynamic from "next/dynamic";
import { useState } from "react";

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then(
            (mod) => mod.ReactQueryDevtools,
          ),
        { ssr: false },
      )
    : () => null;

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error: unknown) => {
              // 401, 403 에러는 재시도하지 않음 (인증 실패)
              const errorStatus = (error as { status?: number })?.status;
              if (errorStatus === 401 || errorStatus === 403) {
                return false;
              }
              // 그 외 에러는 최대 3번까지 재시도
              return failureCount < 3;
            },
            staleTime: 1000 * 60 * 5, // 5분
            refetchOnWindowFocus: true, // 윈도우 포커스 시 재요청
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
