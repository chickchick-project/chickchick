"use client";

import { AgeField, GenderField, NicknameField } from "../field";

export const ProfileForm = () => {
  return (
    <div className="grid grid-cols-[100px_200px] justify-center items-center gap-y-3 gap-x-6">
      <NicknameField />
      <AgeField />
      <GenderField />
    </div>
  );
};
