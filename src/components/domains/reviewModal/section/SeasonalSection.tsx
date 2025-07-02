"use client";

import { SubTitle } from "../SubTitle";
import { REVIEW_OPTIONS } from "../constants";
import { RadioButton } from "../button/RadioButton";
import { Controller } from "react-hook-form";
import { useReviewModal } from "../hooks";

export const SeasonalSection = () => {
  const { control, getSelectedKey, handleSelect } = useReviewModal("seasonal");

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 어울리는 계절은 무엇인가요?</SubTitle>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => {
          const selectedSeasonalKey = getSelectedKey(field.value);

          return (
            <div className="flex gap-[60px] justify-center items-center w-full">
              {REVIEW_OPTIONS.seasonal.map((option) => (
                <RadioButton
                  key={option.key}
                  isSelected={selectedSeasonalKey === option.key}
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
