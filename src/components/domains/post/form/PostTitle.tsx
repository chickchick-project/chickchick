import InputBase from "@/components/commons/input";
import SubTitleLabel from "./element/SubTitleLabel";
import { useFormContext } from "react-hook-form";

export default function PostTitle() {
  const { register, formState } = useFormContext();
  const error = formState.errors.title?.message as string | undefined;
  return (
    <>
      <SubTitleLabel label="제목" htmlFor="title" isRequired />
      <InputBase
        {...register("title")}
        id="title"
        name="title"
        isError={error ? true : false}
        helperText={error || "최대 한글 20자, 영어 30자, 숫자 혼용 가능"}
        placeholder="제목을 입력하세요."
      />
    </>
  );
}
