import { Suspense } from "react";
import PageWrapper from "@/components/commons/wrapper/PageWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex flex-col items-center">{children}</div>}>
      <PageWrapper className="flex flex-col items-center">{children}</PageWrapper>
    </Suspense>
  );
}
