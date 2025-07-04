"use client";

import { ImageButton } from "../button/ImageButton";
import { REVIEW_OPTIONS } from "../constants";
import { SubTitle } from "../SubTitle";
import { Controller } from "react-hook-form";
import { useReviewModal } from "../hooks";

export const FeelingSection = () => {
  const { control, getSelectedKey, handleSelect } = useReviewModal("feeling");

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 대해 어떻게 느끼시나요?</SubTitle>
      <Controller
        name="tags"
        control={control}
        render={({ field }) => {
          const selectedFeelingKey = getSelectedKey(field.value);
          return (
            <div className="flex gap-4 justify-between w-full tablet:px-10">
              {REVIEW_OPTIONS.feeling.map((option) => (
                <ImageButton
                  key={option.key}
                  image={option.image}
                  image_selected={option.image_selected}
                  isSelected={selectedFeelingKey === option.key}
                  onClick={() =>
                    handleSelect(field.value, option.key, field.onChange)
                  }
                >
                  {option.label}
                </ImageButton>
              ))}
            </div>
          );
        }}
      />
    </div>
  );
};
