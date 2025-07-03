import dynamic from "next/dynamic";
import SubTitleLabel from "./element/SubTitleLabel";
import EditorLoading from "@/components/commons/ckeditor5/EditorLoading";
import { Controller, useFormContext } from "react-hook-form";
const CkEditor5 = dynamic(
  () => import("@/components/commons/ckeditor5/CkEditor5"),
  { ssr: false, loading: () => <EditorLoading /> }
);

export default function PostEditor() {
  const { control } = useFormContext();

  return (
    <>
      <SubTitleLabel label="내용" isRequired />
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <CkEditor5 content={field.value} onChange={field.onChange} />
        )}
      />
    </>
  );
}
