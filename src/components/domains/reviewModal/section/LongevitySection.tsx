"use client";

import { SelectButton } from "../button/SelectButton";
import { REVIEW_OPTIONS } from "../constants";
import { SubTitle } from "../SubTitle";
import { Controller, useFormContext } from "react-hook-form";

export const LongevitySection = () => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>얼마나 지속되나요?</SubTitle>
      <Controller
        name="longevity"
        control={control}
        render={({ field }) => (
          <div className="tablet:grid tablet:grid-cols-2 flex flex-col gap-4">
            {REVIEW_OPTIONS.longevity.map((option) => (
              <SelectButton
                key={option.key}
                width="100%"
                isSelected={field.value === option.key}
                onClick={() => field.onChange(option.key)}
              >
                {option.label}
              </SelectButton>
            ))}
          </div>
        )}
      />
    </div>
  );
};
