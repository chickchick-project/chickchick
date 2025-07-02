"use client";

import { SelectButton } from "../button/SelectButton";
import { REVIEW_OPTIONS } from "../constants";
import { SubTitle } from "../SubTitle";
import { Controller } from "react-hook-form";
import { useReviewModal } from "../hooks";

export const LastingSection = () => {
  const { control, getSelectedKey, handleSelect } = useReviewModal("lasting");

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>얼마나 지속되나요?</SubTitle>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => {
          const selectedLastingKey = getSelectedKey(field.value);

          return (
            <div className="tablet:grid tablet:grid-cols-2 flex flex-col gap-4">
              {REVIEW_OPTIONS.lasting.map((option) => (
                <SelectButton
                  key={option.key}
                  width="100%"
                  isSelected={selectedLastingKey === option.key}
                  onClick={() =>
                    handleSelect(field.value, option.key, field.onChange)
                  }
                >
                  {option.label}
                </SelectButton>
              ))}
            </div>
          );
        }}
      />
    </div>
  );
};
