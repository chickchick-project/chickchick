import PageClient from "@/components/domains/community/PageClient";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "커뮤니티 | ChickChick",
  description:
    "향수 애호가들과 소통하고, 다양한 향수 정보와 경험을 공유하세요. ChickChick 커뮤니티에서 나만의 향수 이야기를 나눠보세요.",
  openGraph: {
    title: "커뮤니티",
    description:
      "향수 애호가들과 소통하고, 다양한 향수 정보와 경험을 공유하세요. ChickChick 커뮤니티에서 나만의 향수 이야기를 나눠보세요.",
    type: "website",
  },
};

export default function Page() {
  const ClientFallback = () => <div>로딩 중...</div>;
  return (
    <Suspense fallback={<ClientFallback />}>
      <PageClient />
    </Suspense>
  );
}
