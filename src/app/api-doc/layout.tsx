import React from "react";

export default function ApiDocLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }
  return <>{children}</>;
}
