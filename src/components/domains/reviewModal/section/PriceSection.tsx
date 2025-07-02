"use client";

import { SubTitle } from "../SubTitle";
import { REVIEW_OPTIONS } from "../constants";
import { SelectButton } from "../button/SelectButton";
import { useReviewModal } from "../hooks";
import { Controller } from "react-hook-form";

export const PriceSection = () => {
  const { control, getSelectedKey, handleSelect } = useReviewModal("price");

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>가격은 어떤가요?</SubTitle>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => {
          const selectedPriceKey = getSelectedKey(field.value);
          return (
            <div className="flex tablet:flex-row flex-col gap-4">
              {REVIEW_OPTIONS.price.map((option) => (
                <SelectButton
                  key={option.key}
                  width="w-full tablet:w-[198px]"
                  isSelected={selectedPriceKey === option.key}
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
