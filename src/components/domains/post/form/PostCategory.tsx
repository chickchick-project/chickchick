import BoardDropdown from "@/components/commons/dropdown/BoardDropdown";
import SubTitleLabel from "./element/SubTitleLabel";
export default function PostCategory() {
  return (
    <>
      <SubTitleLabel label="카테고리" id="community-category" isRequired />
      <BoardDropdown id="category" ariaLabelledBy="community-category" />
    </>
  );
}
