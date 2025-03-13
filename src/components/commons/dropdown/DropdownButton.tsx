import { ReactNode } from "react";

export interface IDropdownButtonProps extends React.ComponentProps<"button"> {
  children: ReactNode;
  isSelected: boolean;
}

export default function DropdownButton({ children, isSelected, className, ...rest }: IDropdownButtonProps) {
  const baseStyle =
    "flex justify-between items-center text-center leading-none h-8 tablet:h-10 border text-label-2 tablet:text-body-2 tablet:py-2 tablet:px-4 px-2 py-2 gap-2 rounded-md tablet:rounded-lg hover:border-gray-100 hover:bg-gray-300 hover:text-gray-100";
  const selectedStyle = isSelected ? "border-primary-200 text-primary-200" : "border-gray-100 text-gray-100";
  return (
    <>
      <button type="button" className={`${baseStyle} ${selectedStyle} ${className}`} {...rest}>
        {children}
      </button>
    </>
  );
}
