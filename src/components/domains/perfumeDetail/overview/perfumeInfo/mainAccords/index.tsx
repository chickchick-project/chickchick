import AccordChip from "@/components/commons/chip/AccordChip";
import { TAccords } from "@/lib/constants/accords";

interface PerfumeInfoMainAccordProps {
  accords: {
    id: string;
    name: TAccords;
  }[];
}

export const PerfumeInfoMainAccord = ({
  accords,
}: PerfumeInfoMainAccordProps) => {
  console.log(accords);
  return (
    <section>
      <h2 className="text-label-1 tablet:text-body-1 font-semibold pb-2 table:pb-3">
        메인 어코드
      </h2>
      <ul className="flex gap-2 flex-wrap">
        {accords.map(({ id, name }) => (
          <li key={id}>
            <AccordChip accord={name} />
          </li>
        ))}
      </ul>
    </section>
  );
};
