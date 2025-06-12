import BoardDropdown from "@/components/commons/dropdown/BoardDropdown";
import SubTitleLabel from "./element/SubTitleLabel";

interface IPostCategoryProps {
  value?: string;
  onChange?: (category: string) => void;
}

export default function PostCategory({ value, onChange }: IPostCategoryProps) {
  return (
    <>
      <SubTitleLabel label="카테고리" id="community-category" isRequired />
      <BoardDropdown
        id="category"
        ariaLabelledBy="community-category"
        currentOption={value}
        onChange={onChange}
      />
    </>
  );
}
