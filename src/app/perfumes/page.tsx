import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import getQueryClient from "@/lib/utils/getQueryClient";
import { brandApi } from "@/lib/utils/api/brands.api";
import { perfumeApi } from "@/lib/utils/api/perfumes.api";
import PageClient from "@/components/domains/perfumes/PageClient";

export default async function Page() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["brand", "list"],
      queryFn: () => brandApi.list(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["perfume", "notes"],
      queryFn: () => perfumeApi.notes(),
    }),
    queryClient.prefetchQuery({
      queryKey: ["perfume", "accords"],
      queryFn: () => perfumeApi.accords(),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageClient />
    </HydrationBoundary>
  );
}
