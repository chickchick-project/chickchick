"use client";

import { Controller, useFormContext } from "react-hook-form";
import { REVIEW_OPTIONS } from "@/components/domains/perfumeDetail/review/review.constants";
import { ImageButton } from "../button/ImageButton";
import { SubTitle } from "../SubTitle";

export const FeelingSection = () => {
  const { control } = useFormContext();
  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 대해 어떻게 느끼시나요?</SubTitle>
      <Controller
        name="feeling"
        control={control}
        render={({ field }) => (
          <div className="flex gap-4 justify-between w-full tablet:px-10">
            {REVIEW_OPTIONS.feeling.map((option) => (
              <ImageButton
                key={option.key}
                image={option.image!}
                image_selected={option.image_selected!}
                isSelected={field.value === option.key}
                onClick={() => field.onChange(option.key)}
              >
                {option.label}
              </ImageButton>
            ))}
          </div>
        )}
      />
    </div>
  );
};
