"use client";

import { PerfumeUsageStatus } from "@prisma/client";
import { useFormContext, Controller } from "react-hook-form";
import { SelectButton } from "../button/SelectButton";
import { SubTitle } from "../SubTitle";
import { REVIEW_OPTIONS } from "@/shared/constants/review";
import type { CreateReviewClientInput } from "../../reviewSchema.client";

export const StatusSection = () => {
  const { control } = useFormContext<CreateReviewClientInput>();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>향수를 가지고 있나요?</SubTitle>
      <Controller
        name="usageStatus"
        control={control}
        defaultValue={REVIEW_OPTIONS.status[0].key as PerfumeUsageStatus}
        render={({ field }) => (
          <div className="flex tablet:flex-row flex-col gap-4">
            {REVIEW_OPTIONS.status.map((option) => (
              <SelectButton
                key={option.key}
                width="w-full tablet:w-[198px]"
                isSelected={field.value === option.key}
                onClick={() => field.onChange(option.key as PerfumeUsageStatus)}
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
