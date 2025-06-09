import ICONS from "@/lib/constants/icons";
import Image from "next/image";

interface ISelectButton {
  children: React.ReactNode;
  width: string;
  isSelected: boolean;
  onClick: () => void;
}

export const SelectButton = ({
  children,
  width,
  isSelected,
  onClick,
}: ISelectButton) => {
  return (
    <button
      className={`flex justify-between items-center w-[${width}] p-4 rounded-lg border ${
        isSelected
          ? "border-primary-100 bg-primary-500 text-primary-100"
          : "border-gray-100 bg-white text-black-200"
      } hover:bg-primary-600 font-medium text-[15px] leading-normal`}
      onClick={onClick}
    >
      {children}
      {isSelected ? (
        <Image
          src={ICONS.CheckPrimary.src}
          alt={ICONS.CheckPrimary.alt}
          width={24}
          height={24}
        />
      ) : (
        <Image
          src={ICONS.CheckGray.src}
          alt={ICONS.CheckGray.alt}
          width={24}
          height={24}
        />
      )}
    </button>
  );
};
