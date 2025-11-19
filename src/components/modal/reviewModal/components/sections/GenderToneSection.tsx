"use client";

import { Controller, useFormContext } from "react-hook-form";
import { RadioButton } from "../button/RadioButton";
import { SubTitle } from "../SubTitle";
import { REVIEW_OPTIONS } from "@/lib/constants/review";
import { useFormError } from "../../hooks/useFormError";

export const GenderToneSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const firstErrorField = useFormError();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수가 떠오르게 하는 이미지는 어떤가요?</SubTitle>
      <Controller
        name="attributes.genderTone"
        control={control}
        render={({ field }) => (
          <>
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
            {firstErrorField === "attributes.genderTone" &&
              errors.attributes &&
              "genderTone" in errors.attributes && (
                <p className="text-red-500 text-sm text-center">
                  {String(
                    (errors.attributes.genderTone as { message?: string })
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
