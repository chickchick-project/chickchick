import dynamic from "next/dynamic";
import SubTitleLabel from "./element/SubTitleLabel";
import EditorLoading from "@/components/commons/tiptap/EditorLoading";
import { Controller, useFormContext } from "react-hook-form";
import { BlobRegistry } from "@/client/tiptap/blobRegistry";
import { MutableRefObject } from "react";

const TiptapEditor = dynamic(
  () => import("@/components/commons/tiptap/TiptapEditor"),
  { ssr: false, loading: () => <EditorLoading /> }
);

export default function PostEditor({
  blobRegistryRef,
}: {
  blobRegistryRef: MutableRefObject<BlobRegistry>;
}) {
  const { control } = useFormContext();

  return (
    <>
      <SubTitleLabel label="내용" isRequired />
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <TiptapEditor
            content={field.value}
            onChange={field.onChange}
            blobRegistryRef={blobRegistryRef}
          />
        )}
      />
    </>
  );
}
