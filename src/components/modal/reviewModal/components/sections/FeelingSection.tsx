"use client";

import { Controller, useFormContext } from "react-hook-form";
import { ImageButton } from "../button/ImageButton";
import { SubTitle } from "../SubTitle";
import { REVIEW_OPTIONS } from "@/shared/constants/review";
import { useFormError } from "../../hooks/useFormError";

export const FeelingSection = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const firstErrorField = useFormError();
  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 대해 어떻게 느끼시나요?</SubTitle>
      <Controller
        name="attributes.feeling"
        control={control}
        render={({ field }) => (
          <>
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
            {firstErrorField === "attributes.feeling" &&
              errors.attributes &&
              "feeling" in errors.attributes && (
                <p className="text-red-500 text-sm text-center">
                  {String(
                    (errors.attributes.feeling as { message?: string })
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
