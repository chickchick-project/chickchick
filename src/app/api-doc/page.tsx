"use client";

import { lazy, Suspense } from "react";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = lazy(() => import("swagger-ui-react"));

function SwaggerDocs() {
  return (
    <section style={{ backgroundColor: "#fff", padding: "1rem" }}>
      <Suspense fallback={<div>Loading API Documentation...</div>}>
        <SwaggerUI url="/api/doc" />
      </Suspense>
    </section>
  );
}

export default function Page() {
  return <SwaggerDocs />;
}
