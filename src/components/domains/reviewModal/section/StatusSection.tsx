"use client";

import { useState } from "react";
import { SelectButton } from "../button/SelectButton";
import { REVIEW_OPTIONS } from "../constants";
import { SubTitle } from "../SubTitle";

export const StatusSection = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>향수를 가지고 있나요?</SubTitle>
      <div className="flex mobile:flex-row flex-col gap-4">
        {REVIEW_OPTIONS.status.map((option) => (
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
