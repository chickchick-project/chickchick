import { Suspense } from "react";
import { SkeletonMasonry } from "@/components/domains/user/components/skeletons";

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<SkeletonMasonry />}>{children}</Suspense>;
}
