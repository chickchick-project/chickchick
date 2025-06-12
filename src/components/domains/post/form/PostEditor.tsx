import SubTitleLabel from "./element/SubTitleLabel";

export default function PostEditor() {
  return (
    <>
      <SubTitleLabel label="내용" htmlFor="community-editor" isRequired />
      {/* 텍스트 에디터로 변경예정 */}
      <textarea id="community-editor" className="border border-gray-100" />
    </>
  );
}
