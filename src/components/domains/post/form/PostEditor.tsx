import dynamic from "next/dynamic";
import SubTitleLabel from "./element/SubTitleLabel";
import EditorLoading from "@/components/commons/tiptap/EditorLoading";
import { Controller, useFormContext } from "react-hook-form";
import { BlobRegistry } from "@/client/tiptap/blobRegistry";
import { MutableRefObject } from "react";

const TiptapEditor = dynamic(
  () => import("@/components/commons/tiptap/TiptapEditor"),
  { ssr: false, loading: () => <EditorLoading /> },
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
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-1">
            <TiptapEditor
              content={field.value}
              onChange={field.onChange}
              blobRegistryRef={blobRegistryRef}
            />
            {fieldState.error && (
              <p className="text-sm text-red">{fieldState.error.message}</p>
            )}
          </div>
        )}
      />
    </>
  );
}
