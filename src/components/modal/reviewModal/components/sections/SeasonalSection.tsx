"use client";

import { REVIEW_OPTIONS } from "@/lib/constants/review";
import { SubTitle } from "../SubTitle";
import { RadioButton } from "../button/RadioButton";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";

export const SeasonalSection = () => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 어울리는 계절은 무엇인가요?</SubTitle>
      <Controller
        name="attributes.season"
        control={control}
        render={({ field }) => {
          const currentValues = field.value || [];

          return (
            <div className="flex gap-[60px] justify-center items-center w-full">
              {REVIEW_OPTIONS.season.map((option) => {
                const isSelected = currentValues.includes(option.key);
                return (
                  <RadioButton
                    key={option.key}
                    isSelected={isSelected}
                    onClick={() => field.onChange([option.key])}
                  >
                    {option.label}
                  </RadioButton>
                );
              })}
            </div>
          );
        }}
      />
    </div>
  );
};
