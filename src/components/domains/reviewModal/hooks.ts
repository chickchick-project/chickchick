import { Review } from "@prisma/client";
import { useFormContext } from "react-hook-form";
import { REVIEW_OPTIONS } from "./constants";

type ReviewOptionKey = keyof typeof REVIEW_OPTIONS;

export const useReviewModal = (optionKey: ReviewOptionKey) => {
  const { control } = useFormContext<Review>();

  const optionKeys = REVIEW_OPTIONS[optionKey].map((option) => option.key);

  const getSelectedKey = (tags: string[]) => {
    return tags?.find((tag) => optionKeys.includes(tag));
  };

  const handleSelect = (
    tags: string[],
    key: string,
    onChange: (tags: string[]) => void
  ) => {
    const newTags = (tags || []).filter((tag) => !optionKeys.includes(tag));
    onChange([...newTags, key]);
  };

  return {
    control,
    optionKeys,
    getSelectedKey,
    handleSelect,
  };
};
