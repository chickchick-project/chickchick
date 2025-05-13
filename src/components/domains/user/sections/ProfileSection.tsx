"use client";

import { useState } from "react";
import Dropdown from "@/components/commons/dropdown/DropdownBase";
import InputBase from "@/components/commons/input";
import { ButtonFilledPrimaryLFull } from "@/components/commons/button/ButtonFilled";
import { ButtonOutlinedPrimaryLFull } from "@/components/commons/button/ButtonOutlined";

const ProfileRow = ({
  label,
  isRequired = false,
  children,
  htmlFor,
}: {
  label: string;
  isRequired?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}) => (
  <>
    {htmlFor ? (
      <label htmlFor={htmlFor} className="text-sm text-gray-600">
        {label}
        {isRequired && <span className="text-red">*</span>}
      </label>
    ) : (
      <p className="text-sm text-gray-600">{label}</p>
    )}
    {children}
  </>
);

type ProfileItem = {
  name: string;
  nickname: string;
  gender: string;
  age: number;
};

export const ProfileSection = ({ data }: { data: ProfileItem }) => {
  const [name, setName] = useState<string>(data.name || "");
  const [nickname, setNickname] = useState<string>(data.nickname || "");
  const [age, setAge] = useState<number>(data.age || 0);
  const [gender, setGender] = useState<string>(data.gender || "");

  return (
    <div className="p-[120px]">
      <div className="grid grid-cols-[200px_1fr] items-center gap-y-3 gap-x-6">
        <ProfileRow label="이름" htmlFor="name" isRequired>
          <InputBase
            value={name}
            onChange={(e) => setName(e.target.value)}
            isError={false}
          />
        </ProfileRow>

        <ProfileRow label="닉네임" htmlFor="nickname" isRequired>
          <InputBase
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            isError={false}
          />
        </ProfileRow>

        <ProfileRow label="나이" htmlFor="age">
          <Dropdown
            id="age"
            selectedOption={
              age === 0
                ? { value: "0", label: "나이" }
                : { value: age.toString(), label: age.toString() }
            }
            options={Array.from({ length: 100 }, (_, i) => i + 1).map((a) => ({
              value: a.toString(),
              label: a.toString(),
            }))}
            handleChangeOption={(option) => setAge(Number(option.value))}
          />
        </ProfileRow>

        <ProfileRow label="성별" htmlFor="gender">
          <Dropdown
            id="gender"
            selectedOption={
              gender === ""
                ? { value: "", label: "성별" }
                : { value: gender, label: gender === "male" ? "남성" : "여성" }
            }
            options={[
              { value: "", label: "성별" },
              { value: "male", label: "남성" },
              { value: "female", label: "여성" },
            ]}
            handleChangeOption={(option) => setGender(option.value)}
          />
        </ProfileRow>
      </div>
      <div className="flex justify-center items-center gap-2 mt-20">
        <div className="flex gap-2 w-[368px]">
          <ButtonOutlinedPrimaryLFull>탈퇴</ButtonOutlinedPrimaryLFull>
          <ButtonFilledPrimaryLFull>수정</ButtonFilledPrimaryLFull>
        </div>
      </div>
    </div>
  );
};
