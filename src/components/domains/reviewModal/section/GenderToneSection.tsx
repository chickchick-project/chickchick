"use client";

import { useState } from "react";
import { RadioButton } from "../button/RadioButton";
import { REVIEW_OPTIONS } from "../constants";
import { SubTitle } from "../SubTitle";

export const GenderToneSection = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수가 떠오르게 하는 이미지는 어떤가요?</SubTitle>
      <div className="flex gap-[60px] justify-center items-center w-full">
        {REVIEW_OPTIONS.gender_tone.map((option) => (
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
