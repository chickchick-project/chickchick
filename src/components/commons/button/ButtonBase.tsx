import { BACKGROUND_COLORS, TBgColor } from "@/lib/constants/colors";
import { ReactNode } from "react";

export interface IButtonBaseProps extends React.ComponentProps<"button"> {
  children: ReactNode;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
  iconGap?: string;
  bgColor: TBgColor;
  colorNum?: string;
}

export default function ButtonBase(props: IButtonBaseProps) {
  const {
    children,
    className,
    iconLeading,
    iconTrailing,
    bgColor,
    iconGap,
    colorNum = "100",
    ...restProps
  } = props;

  const colorValue = BACKGROUND_COLORS[bgColor];
  const buttonColor =
    typeof colorValue === "string"
      ? colorValue
      : colorValue[colorNum] || colorValue["100"];
  const resolvedIconGap =
    iconGap ??
    (iconLeading && iconTrailing
      ? "gap-2"
      : iconLeading || iconTrailing
      ? "gap-1"
      : "");

  return (
    <button
      {...restProps}
      className={`${className} ${buttonColor} disabled:bg-gray-300 disabled:text-black-200 disabled:border-none disabled:cursor-not-allowed`}
    >
      <div
        className={`flex items-center justify-center leading-none ${resolvedIconGap}`}
      >
        {iconLeading}
        {children}
        {iconTrailing}
      </div>
    </button>
  );
}
