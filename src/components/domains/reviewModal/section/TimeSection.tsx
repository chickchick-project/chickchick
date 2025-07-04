"use client";

import { SubTitle } from "../SubTitle";
import { REVIEW_OPTIONS } from "../constants";
import { RadioButton } from "../button/RadioButton";
import { Controller } from "react-hook-form";
import { useReviewModal } from "../hooks";

export const TimeSection = () => {
  const { control, getSelectedKey, handleSelect } = useReviewModal("time");

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 어울리는 시간대는 언제인가요?</SubTitle>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => {
          const selectedTimeKey = getSelectedKey(field.value);
          return (
            <div className="flex gap-[120px] justify-center items-center w-full">
              {REVIEW_OPTIONS.time.map((option) => (
                <RadioButton
                  key={option.key}
                  isSelected={selectedTimeKey === option.key}
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
