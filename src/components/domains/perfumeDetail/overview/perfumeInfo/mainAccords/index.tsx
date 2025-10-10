import AccordChip from "@/components/commons/chip/AccordChip";
import { IAccordMapping } from "@/lib/types/perfumeDetail";

interface PerfumeInfoMainAccordProps {
  accords: IAccordMapping[];
}

export const PerfumeInfoMainAccord = ({
  accords,
}: PerfumeInfoMainAccordProps) => {
  return (
    <section>
      <h2 className="text-label-1 tablet:text-body-1 font-semibold pb-2 tablet:pb-3">
        메인 어코드
      </h2>
      <ul className="flex gap-2 flex-wrap">
        {accords.map(({ accord }) => (
          <li key={accord.id}>
            <AccordChip accord={accord.nameKo} />
          </li>
        ))}
      </ul>
    </section>
  );
};
