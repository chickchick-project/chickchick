import { useFormContext } from "react-hook-form";

/**
 * 폼의 첫 번째 에러 필드를 반환하는 커스텀 훅
 */
export const useFormError = () => {
  const {
    formState: { errors },
  } = useFormContext();

  const fieldOrder = [
    "attributes.feeling",
    "attributes.longevity",
    "attributes.sillage",
    "attributes.genderTone",
    "attributes.season",
    "attributes.timeOfDay",
    "attributes.pricePerception",
  ];

  // 첫 번째 에러 필드 찾기
  const firstErrorField = fieldOrder.find((field) => {
    const [parent, child] = field.split(".");
    return (
      errors[parent] &&
      typeof errors[parent] === "object" &&
      child in (errors[parent] as object)
    );
  });

  return firstErrorField;
};
