import { useState } from "react";
import { SubTitle } from "../SubTitle";
import { REVIEW_OPTIONS } from "../constants";
import { RadioButton } from "../button/RadioButton";

export const SeasonalSection = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 어울리는 계절은 무엇인가요?</SubTitle>
      <div className="flex gap-[60px] justify-center items-center w-full">
        {REVIEW_OPTIONS.seasonal.map((option) => (
          <RadioButton
            key={option.key}
            isSelected={selectedKey === option.key}
            onClick={() => setSelectedKey(option.key)}
          >
            {option.label}
          </RadioButton>
        ))}
      </div>
    </div>
  );
};
