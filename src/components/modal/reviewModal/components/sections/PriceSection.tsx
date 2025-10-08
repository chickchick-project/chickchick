"use client";

import { useFormContext, Controller } from "react-hook-form";
import { REVIEW_OPTIONS } from "@/lib/constants/review";
import { SubTitle } from "../SubTitle";
import { SelectButton } from "../button/SelectButton";

export const PriceSection = () => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>가격은 어떤가요?</SubTitle>
      <Controller
        name="attributes.pricePerception"
        control={control}
        render={({ field }) => (
          <div className="flex tablet:flex-row flex-col gap-4">
            {REVIEW_OPTIONS.pricePerception.map((option) => (
              <SelectButton
                key={option.key}
                width="w-full tablet:w-[198px]"
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
