import { useState } from "react";
import { SelectButton } from "../button/SelectButton";
import { REVIEW_OPTIONS } from "../constants";
import { SubTitle } from "../SubTitle";

export const SillageSection = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>얼마나 지속되나요?</SubTitle>
      <div className="flex flex-col gap-4">
        {REVIEW_OPTIONS.sillage.map((option) => (
          <SelectButton
            key={option.key}
            width="100%"
            isSelected={selectedKey === option.key}
            onClick={() => setSelectedKey(option.key)}
          >
            {option.label}
          </SelectButton>
        ))}
      </div>
    </div>
  );
};
