"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import "swagger-ui-react/swagger-ui.css";

// 프로덕션 환경에서는 404 처리
if (process.env.NODE_ENV === "production") {
  notFound();
}

const SwaggerUI = dynamic(
  () => import("swagger-ui-react").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  },
);

export default function Page() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-screen">
      <SwaggerUI
        url="/api/doc"
        deepLinking={true}
        displayRequestDuration={true}
      />
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Loading API Documentation...</p>
      </div>
    </div>
  );
}
