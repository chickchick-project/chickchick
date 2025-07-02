"use client";

import { RadioButton } from "../button/RadioButton";
import { REVIEW_OPTIONS } from "../constants";
import { SubTitle } from "../SubTitle";
import { useReviewModal } from "../hooks";
import { Controller } from "react-hook-form";

export const GenderToneSection = () => {
  const { control, getSelectedKey, handleSelect } =
    useReviewModal("gender_tone");

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수가 떠오르게 하는 이미지는 어떤가요?</SubTitle>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => {
          const selectedGenderToneKey = getSelectedKey(field.value);

          return (
            <div className="flex gap-[60px] justify-center items-center w-full">
              {REVIEW_OPTIONS.gender_tone.map((option) => (
                <RadioButton
                  key={option.key}
                  isSelected={selectedGenderToneKey === option.key}
                  onClick={() =>
                    handleSelect(field.value, option.key, field.onChange)
                  }
                >
                  {option.label}
                </RadioButton>
              ))}
            </div>
          );
        }}
      />
    </div>
  );
};
