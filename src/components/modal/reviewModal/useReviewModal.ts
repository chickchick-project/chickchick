import { useFormContext } from "react-hook-form";
import { REVIEW_OPTIONS } from "@/lib/constants/review";
import { Review } from "@zod/modelSchema";

type ReviewOptionKey = keyof typeof REVIEW_OPTIONS;
type OptionKeyUnion<T extends ReviewOptionKey> =
  (typeof REVIEW_OPTIONS)[T][number]["key"];

export const useReviewModal = <T extends ReviewOptionKey>(optionKey: T) => {
  const { control } = useFormContext<Review>();
  const optionKeys = REVIEW_OPTIONS[optionKey].map(
    (option) => option.key
  ) as OptionKeyUnion<T>[];

  const getSelectedKey = (tags: string[]) => {
    return tags?.find((tag) => optionKeys.includes(tag as OptionKeyUnion<T>));
  };

  const handleSelect = (
    tags: string[],
    key: OptionKeyUnion<T>,
    onChange: (tags: string[]) => void
  ) => {
    const newTags = (tags || []).filter(
      (tag) => !optionKeys.includes(tag as OptionKeyUnion<T>)
    );
    onChange([...newTags, key]);
  };

  return {
    control,
    optionKeys,
    getSelectedKey,
    handleSelect,
  };
};
