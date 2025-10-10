"use client";

import { REVIEW_OPTIONS } from "@/lib/constants/review";
import { SubTitle } from "../SubTitle";
import { RadioButton } from "../button/RadioButton";
import { Controller, useFormContext } from "react-hook-form";

export const TimeSection = () => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 어울리는 시간대는 언제인가요?</SubTitle>
      <Controller
        name="attributes.timeOfDay"
        control={control}
        render={({ field }) => (
          <div className="flex gap-[120px] justify-center items-center w-full">
            {REVIEW_OPTIONS.timeOfDay.map((option) => (
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
