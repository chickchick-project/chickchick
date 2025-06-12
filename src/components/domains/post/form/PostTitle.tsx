import InputBase from "@/components/commons/input";
import SubTitleLabel from "./element/SubTitleLabel";
import { ChangeEvent } from "react";

interface IPostTitleProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function PostTitle({ value, onChange }: IPostTitleProps) {
  return (
    <>
      <SubTitleLabel label="제목" htmlFor="title" isRequired />
      <InputBase
        id="title"
        name="title"
        value={value}
        onChange={onChange}
        required
        isError={false}
        helperText="최대 한글 20자, 영어 30자, 숫자 혼용 가능"
        placeholder="제목을 입력하세요."
      />
    </>
  );
}
