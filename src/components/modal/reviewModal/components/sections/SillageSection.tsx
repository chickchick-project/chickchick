"use client";

import { SelectButton } from "../button/SelectButton";
import { REVIEW_OPTIONS } from "@/components/domains/perfumeDetail/review/review.constants";
import { SubTitle } from "../SubTitle";
import { Controller, useFormContext } from "react-hook-form";

export const SillageSection = () => {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>잔향감</SubTitle>
      <Controller
        name="attributes.sillage"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-4">
            {REVIEW_OPTIONS.sillage.map((option) => (
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
