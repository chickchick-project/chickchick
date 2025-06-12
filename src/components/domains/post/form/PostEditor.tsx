import dynamic from "next/dynamic";
import SubTitleLabel from "./element/SubTitleLabel";
import EditorLoading from "@/components/commons/ckeditor5/EditorLoading";
const CkEditor5 = dynamic(
  () => import("@/components/commons/ckeditor5/CkEditor5"),
  { ssr: false, loading: () => <EditorLoading /> }
);
interface IPostEditorProps {
  value: string;
  onChange: (content: string) => void;
}

export default function PostEditor({ value, onChange }: IPostEditorProps) {
  return (
    <>
      <SubTitleLabel label="내용" htmlFor="community-editor" isRequired />
      <CkEditor5 id="community-editor" content={value} onChange={onChange} />
    </>
  );
}
