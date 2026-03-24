"use client";

import { REVIEW_OPTIONS } from "@/shared/constants/review";
import { SelectButton } from "../button/SelectButton";
import { SubTitle } from "../SubTitle";
import { Controller, useFormContext } from "react-hook-form";
import { useFormError } from "../../hooks/useFormError";

export const SillageSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const firstErrorField = useFormError();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>잔향감</SubTitle>
      <Controller
        name="attributes.sillage"
        control={control}
        render={({ field }) => (
          <>
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
            {firstErrorField === "attributes.sillage" &&
              errors.attributes &&
              "sillage" in errors.attributes && (
                <p className="text-red-500 text-sm text-center">
                  {String(
                    (errors.attributes.sillage as { message?: string })
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
