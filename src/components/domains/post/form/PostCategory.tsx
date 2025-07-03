import BoardDropdown from "@/components/commons/dropdown/BoardDropdown";
import SubTitleLabel from "./element/SubTitleLabel";
import { Controller, useFormContext } from "react-hook-form";

export default function PostCategory() {
  const { control } = useFormContext();

  return (
    <>
      <SubTitleLabel label="카테고리" id="community-category" isRequired />
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <BoardDropdown
            id="category"
            ariaLabelledBy="community-category"
            currentOption={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </>
  );
}
