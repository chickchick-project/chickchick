import { prisma } from "@/lib/prisma";
import PageClient from "@/components/domains/perfumes/PageClient";

export default async function Page() {
  const [brands, notes, accords] = await Promise.all([
    prisma.brand.findMany(),
    prisma.perfumeNote.findMany(),
    prisma.perfumeAccord.findMany(),
  ]);
  return <PageClient brands={brands} notes={notes} accords={accords} />;
}
