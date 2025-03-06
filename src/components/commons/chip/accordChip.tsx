import { ACCORDS, TAccords } from "@/lib/constants/accords";
import ChipBase from "./chipBase";

interface IAccordChipProps {
  accord: TAccords;
}

export default function AccordChip({ accord }: IAccordChipProps) {
  return (
    <ChipBase className={`px-3 py-2 text-label-1 font-medium ${ACCORDS[accord].chipColor}`}>
      {ACCORDS[accord].name.en}
    </ChipBase>
  );
}
