import ICONS from "@/shared/constants/icons";
import Image from "next/image";

interface IRadioButton {
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

export const RadioButton = ({
  children,
  isSelected,
  onClick,
}: IRadioButton) => {
  return (
    <button
      className="flex flex-col justify-center items-center "
      onClick={onClick}
      type="button"
    >
      <div className="rounded-full hover:bg-primary-600">
        {isSelected ? (
          <Image
            src={ICONS.RadioPrimary.src}
            alt={ICONS.RadioPrimary.alt}
            width={40}
            height={40}
          />
        ) : (
          <Image
            src={ICONS.RadioGray.src}
            alt={ICONS.RadioGray.alt}
            width={40}
            height={40}
          />
        )}
      </div>
      <div className={isSelected ? "text-primary-100" : "text-gray-100"}>
        {children}
      </div>
    </button>
  );
};
