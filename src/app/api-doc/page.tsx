"use client";

import { notFound } from "next/navigation";
import { lazy, Suspense } from "react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = lazy(() => import("swagger-ui-react"));

function SwaggerDocs() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <section style={{ backgroundColor: "#fff", padding: "1rem" }}>
      <Suspense fallback={<div>Loading API Documentation...</div>}>
        <SwaggerUI url="/api/doc" />
      </Suspense>
    </section>
  );
}

export default function Page() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return <SwaggerDocs />;
}
