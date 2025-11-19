"use client";

import { REVIEW_OPTIONS } from "@/lib/constants/review";
import { SelectButton } from "../button/SelectButton";
import { SubTitle } from "../SubTitle";
import { Controller, useFormContext } from "react-hook-form";
import { useFormError } from "../../hooks/useFormError";

export const LongevitySection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const firstErrorField = useFormError();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>얼마나 지속되나요?</SubTitle>
      <Controller
        name="attributes.longevity"
        control={control}
        render={({ field }) => (
          <>
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
            {firstErrorField === "attributes.longevity" &&
              errors.attributes &&
              "longevity" in errors.attributes && (
                <p className="text-red-500 text-sm text-center">
                  {String(
                    (errors.attributes.longevity as { message?: string })
                      ?.message || "필수 항목입니다"
                  )}
                </p>
              )}
          </>
        )}
      />
    </div>
  );
};
