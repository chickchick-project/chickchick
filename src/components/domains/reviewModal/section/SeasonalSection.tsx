"use client";

import { SubTitle } from "../SubTitle";
import { REVIEW_OPTIONS } from "../constants";
import { RadioButton } from "../button/RadioButton";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";

export const SeasonalSection = () => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 어울리는 계절은 무엇인가요?</SubTitle>
      <Controller
        name="season"
        control={control}
        render={({ field }) => {
          return (
            <div className="flex gap-[60px] justify-center items-center w-full">
              {REVIEW_OPTIONS.season.map((option) => (
                <RadioButton
                  key={option.key}
                  isSelected={field.value === option.key}
                  onClick={() => field.onChange(option.key)}
                >
                  {option.label}
                </RadioButton>
              ))}
            </div>
          );
        }}
      />
    </div>
  );
};
