import { useState } from "react";
import { SubTitle } from "../SubTitle";
import { REVIEW_OPTIONS } from "../constants";
import { SelectButton } from "../button/SelectButton";

export const PriceSection = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>가격은 어떤가요?</SubTitle>
      <div className="flex mobile:flex-row flex-col gap-4">
        {REVIEW_OPTIONS.price.map((option) => (
          <SelectButton
            key={option.key}
            width="w-full mobile:w-[198px]"
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
