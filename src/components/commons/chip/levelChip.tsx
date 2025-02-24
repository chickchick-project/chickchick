import { ChipFilledPrimary } from "./chipFilled";

interface ILevelChipProps {
  level: number;
}

export default function LevelChip({ level }: ILevelChipProps) {
  return (
    <ChipFilledPrimary className="text-label-3 px-2 py-[2px] h-5 tablet:text-label-1 tablet:px-3 tablet:py-1 tablet:h-[25px]">
      {`Lv.${level}`}
    </ChipFilledPrimary>
  );
}
