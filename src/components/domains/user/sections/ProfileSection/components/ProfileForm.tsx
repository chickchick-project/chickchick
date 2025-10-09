"use client";

import Dropdown from "@/components/commons/dropdown/DropdownBase";
import InputBase from "@/components/commons/input";
import { ProfileRow } from "./ProfileRow";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { ProfileFormData } from "..";

interface ProfileFormProps {
  control: Control<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
}

export const ProfileForm = ({ control, errors }: ProfileFormProps) => {
  return (
    <div className="grid grid-cols-[200px_400px] items-center gap-y-3 gap-x-6">
      <ProfileRow label="이름" htmlFor="name" isRequired>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <InputBase {...field} isError={!!errors.name} />
          )}
        />
      </ProfileRow>

      <ProfileRow label="닉네임" htmlFor="nickname" isRequired>
        <Controller
          name="nickname"
          control={control}
          render={({ field }) => (
            <InputBase {...field} isError={!!errors.nickname} />
          )}
        />
      </ProfileRow>

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
              options={Array.from({ length: 100 }, (_, i) => i + 1).map(
                (a) => ({
                  value: a.toString(),
                  label: a.toString(),
                })
              )}
              handleChangeOption={(option) =>
                field.onChange(Number(option.value))
              }
            />
          )}
        />
      </ProfileRow>

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
                      label: field.value === "male" ? "남성" : "여성",
                    }
                  : { value: "", label: "성별" }
              }
              options={[
                { value: "", label: "성별" },
                { value: "male", label: "남성" },
                { value: "female", label: "여성" },
              ]}
              handleChangeOption={(option) => field.onChange(option.value)}
            />
          )}
        />
      </ProfileRow>
    </div>
  );
};
