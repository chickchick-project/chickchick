"use client";

import { useState } from "react";
import { ImageButton } from "../button/ImageButton";
import { REVIEW_OPTIONS } from "../constants";
import { SubTitle } from "../SubTitle";

export const FeelingSection = () => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-5">
      <SubTitle>이 향수에 대해 어떻게 느끼시나요?</SubTitle>
      <div className="flex gap-4 justify-between w-full px-10">
        {REVIEW_OPTIONS.feeling.map((option) => (
          <ImageButton
            key={option.key}
            image={option.image}
            image_selected={option.image_selected}
            isSelected={selectedKey === option.key}
            onClick={() => setSelectedKey(option.key)}
          >
            {option.label}
          </ImageButton>
        ))}
      </div>
    </div>
  );
};
