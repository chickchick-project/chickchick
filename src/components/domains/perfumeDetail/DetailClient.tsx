import {
  perfumes,
  perfumes_notes_map,
  perfumes_accords_map,
} from "@prisma/client";

type PerfumeDetail = perfumes & {
  perfumes_notes_map: perfumes_notes_map[];
  perfumes_accords_map: perfumes_accords_map[];
};

export const DetailClient = ({ perfume }: { perfume: PerfumeDetail }) => {
  return <div>{JSON.stringify(perfume)}</div>;
};
