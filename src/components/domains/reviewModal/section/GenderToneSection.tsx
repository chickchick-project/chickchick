"use client";

import { RadioButton } from "../button/RadioButton";
import { REVIEW_OPTIONS } from "../constants";
import { SubTitle } from "../SubTitle";
import { Controller, useFormContext } from "react-hook-form";

export const GenderToneSection = () => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수가 떠오르게 하는 이미지는 어떤가요?</SubTitle>
      <Controller
        name="genderTone"
        control={control}
        render={({ field }) => (
          <div className="flex gap-[60px] justify-center items-center w-full">
            {REVIEW_OPTIONS.gender_tone.map((option) => (
              <RadioButton
                key={option.key}
                isSelected={field.value === option.key}
                onClick={() => field.onChange(option.key)}
              >
                {option.label}
              </RadioButton>
            ))}
          </div>
        )}
      />
    </div>
  );
};
