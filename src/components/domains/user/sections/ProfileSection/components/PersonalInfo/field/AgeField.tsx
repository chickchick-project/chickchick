import { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import { Controller, useFormContext } from "react-hook-form";
import { ProfileRow } from "../common/ProfileRow";
import Dropdown from "@/components/commons/dropdown/DropdownBase";

export const AgeField = () => {
  const { control } = useFormContext<ApiMyProfileResponse>();

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
                ? {
                    value: field.value.toString(),
                    label: field.value.toString(),
                  }
                : { value: "0", label: "나이" }
            }
            options={Array.from({ length: 100 }, (_, i) => i + 1).map((a) => ({
              value: a.toString(),
              label: a.toString(),
            }))}
            handleChangeOption={(option) =>
              field.onChange(Number(option.value))
            }
          />
        )}
      />
    </ProfileRow>
  );
};
