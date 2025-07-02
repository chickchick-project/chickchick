"use client";

import { SelectButton } from "../button/SelectButton";
import { REVIEW_OPTIONS } from "../constants";
import { SubTitle } from "../SubTitle";
import { useReviewModal } from "../hooks";
import { Controller } from "react-hook-form";

export const SillageSection = () => {
  const { control, getSelectedKey, handleSelect } = useReviewModal("sillage");

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>주변으로 얼마나 퍼지나요?</SubTitle>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => {
          const selectedSillageKey = getSelectedKey(field.value);
          return (
            <div className="flex flex-col gap-4">
              {REVIEW_OPTIONS.sillage.map((option) => (
                <SelectButton
                  key={option.key}
                  width="100%"
                  isSelected={selectedSillageKey === option.key}
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
