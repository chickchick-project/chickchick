import { Controller, useFormContext } from "react-hook-form";
import { ProfileRow } from "../common/ProfileRow";
import Dropdown from "@/components/commons/dropdown/DropdownBase";
import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";

export const GenderField = () => {
  const { control } = useFormContext<ApiMyProfileResponse>();

  const GendarLabel = {
    UNKNOWN: "성별",
    MALE: "남성",
    FEMALE: "여성",
  };

  return (
    <ProfileRow label="성별" htmlFor="gender">
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <Dropdown
            id="gender"
            selectedOption={
              field.value
                ? {
                    value: field.value,
                    label: GendarLabel[field.value],
                  }
                : { value: "UNKNOWN", label: "성별" }
            }
            options={[
              { value: "", label: "성별" },
              { value: "MALE", label: "남성" },
              { value: "FEMALE", label: "여성" },
            ]}
            handleChangeOption={(option) => field.onChange(option.value)}
          />
        )}
      />
    </ProfileRow>
  );
};
