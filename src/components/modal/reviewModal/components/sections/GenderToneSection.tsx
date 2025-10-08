"use client";

import { Controller, useFormContext } from "react-hook-form";
import { RadioButton } from "../button/RadioButton";
import { SubTitle } from "../SubTitle";
import { REVIEW_OPTIONS } from "@/lib/constants/review";

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
            {REVIEW_OPTIONS.genderTone.map((option) => (
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
