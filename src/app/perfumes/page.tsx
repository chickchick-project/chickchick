import { prisma } from "@/lib/prisma";
import PageClient from "@/components/domains/perfumes/PageClient";

export default async function Page() {
  const [brands, notes, accords] = await Promise.all([
    prisma.brands.findMany(),
    prisma.perfume_notes.findMany(),
    prisma.perfume_accords.findMany(),
  ]);
  return <PageClient brands={brands} notes={notes} accords={accords} />;
}
