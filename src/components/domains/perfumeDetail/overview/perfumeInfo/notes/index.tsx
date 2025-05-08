import clsx from "clsx";

interface PerfumeInfoNoteProps {
  notes: {
    id: string;
    name: string;
  }[];
}

export const PerfumeInfoNote = ({ notes }: PerfumeInfoNoteProps) => {
  return (
    <section>
      <h2 className="text-label-1 tablet:text-body-1 font-semibold text-black-100 pb-2 tablet:pb-3">
        노트
      </h2>
      <ul className="flex gap-2 items-center flex-wrap">
        {notes.map(({ id, name }, index) => (
          <li key={id} className="flex items-center gap-2">
            <div
              className={clsx(
                index === 0 && "hidden",
                "w-px h-[10px] tablet:h-3 bg-gray-200"
              )}
            />
            <span
              key={id}
              className="text-label-2 tablet:text-body-2 text-black-100 font-medium"
            >
              {name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};
