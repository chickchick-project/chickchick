import { Suspense } from "react";
import PageWrapper from "@/components/commons/wrapper/PageWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>{children}</div>}>
      <PageWrapper>{children}</PageWrapper>
    </Suspense>
  );
}
