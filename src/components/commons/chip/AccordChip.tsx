import { ACCORDS, TAccords } from "@/shared/constants/accords";
import ChipBase from "./ChipBase";

interface IAccordChipProps {
  accord: string;
}

export default function AccordChip({ accord }: IAccordChipProps) {
  return (
    <ChipBase
      className={`px-3 py-2 text-label-1 font-medium ${
        ACCORDS[accord as TAccords]?.chipColor ?? "bg-gray-50"
      }`}
    >
      {accord}
    </ChipBase>
  );
}
