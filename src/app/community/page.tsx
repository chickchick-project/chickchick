import PageClient from "@/components/domains/community/PageClient";
import { Suspense } from "react";

export default function Page() {
  const ClientFallback = () => <div>로딩 중...</div>;
  return (
    <Suspense fallback={<ClientFallback />}>
      <PageClient />
    </Suspense>
  );
}
