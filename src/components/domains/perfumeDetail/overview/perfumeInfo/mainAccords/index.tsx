import AccordChip from "@/components/commons/chip/AccordChip";

interface PerfumeInfoMainAccordProps {
  accords: {
    id: string;
    name: string;
  }[];
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
        {accords.map(({ id, name }) => (
          <li key={id}>
            <AccordChip accord={name} />
          </li>
        ))}
      </ul>
    </section>
  );
};
