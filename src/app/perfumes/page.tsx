import { prisma } from "@/lib/prisma";
import PageClient from "@/components/domains/perfumes/PageClient";

export default async function Page() {
  const [brands, notes] = await Promise.all([
    prisma.brands.findMany(),
    prisma.perfume_notes.findMany(),
  ]);
  return <PageClient brands={brands} notes={notes} />;
}
