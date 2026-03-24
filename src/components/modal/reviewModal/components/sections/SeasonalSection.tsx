"use client";

import { REVIEW_OPTIONS } from "@/shared/constants/review";
import { SubTitle } from "../SubTitle";
import { RadioButton } from "../button/RadioButton";
import { Controller } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useFormError } from "../../hooks/useFormError";

export const SeasonalSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const firstErrorField = useFormError();

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 어울리는 계절은 무엇인가요?</SubTitle>
      <Controller
        name="attributes.season"
        control={control}
        render={({ field }) => {
          const currentValues = field.value || [];

          return (
            <>
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
              {firstErrorField === "attributes.season" &&
                errors.attributes &&
                "season" in errors.attributes && (
                  <p className="text-red-500 text-sm text-center">
                    {String(
                      (errors.attributes.season as { message?: string })
                        ?.message || "필수 항목입니다"
                    )}
                  </p>
                )}
            </>
          );
        }}
      />
    </div>
  );
};
