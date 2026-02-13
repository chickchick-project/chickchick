import type { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import { Controller, useFormContext } from "react-hook-form";
import { ProfileRow } from "../common/ProfileRow";
import Dropdown from "@/components/commons/dropdown/DropdownBase";

export const AgeField = () => {
  const { control } = useFormContext<ApiMyProfileResponse>();

  const options = [
    { value: "private", label: "비공개" },
    ...[10, 20, 30, 40, 50].map((age) => ({
      value: age.toString(),
      label: `${age}대`,
    })),
    { value: "60", label: "60대 이상" },
  ];
  return (
    <ProfileRow label="나이" htmlFor="age">
      <Controller
        name="age"
        control={control}
        render={({ field }) => (
          <Dropdown
            id="age"
            selectedOption={
              field.value
                ? { value: field.value.toString(), label: `${field.value}대` }
                : { value: "private", label: "비공개" }
            }
            options={options}
            handleChangeOption={(option) =>
              field.onChange(
                option.value === "private" ? null : Number(option.value)
              )
            }
          />
        )}
      />
    </ProfileRow>
  );
};
