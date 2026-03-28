import { Suspense } from "react";
import PageClient from "@/components/domains/post/PageClient";

export default async function Page() {
  return (
    <Suspense>
      <PageClient type="create" />
    </Suspense>
  );
}
