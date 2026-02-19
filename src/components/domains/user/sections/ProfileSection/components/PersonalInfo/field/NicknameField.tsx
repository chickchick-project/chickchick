import type { ApiMyProfileResponse } from "@/lib/hono/schemas/me.schema";
import { Controller, useFormContext } from "react-hook-form";
import { ProfileRow } from "../common/ProfileRow";
import InputBase from "@/components/commons/input";

export const NicknameField = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<ApiMyProfileResponse>();

  return (
    <ProfileRow label="닉네임" htmlFor="nickname" isRequired>
      <Controller
        name="nickname"
        control={control}
        render={({ field }) => (
          <InputBase {...field} isError={!!errors.nickname} />
        )}
      />
    </ProfileRow>
  );
};
