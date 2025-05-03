import { BACKGROUND_COLORS, TBgColor } from "@/lib/constants/colors";
import { ReactNode } from "react";

export interface IButtonBaseProps extends React.ComponentProps<"button"> {
  children: ReactNode;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
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
    colorNum = "100",
    ...restProps
  } = props;

  const colorValue = BACKGROUND_COLORS[bgColor];
  const buttonColor =
    typeof colorValue === "string"
      ? colorValue
      : colorValue[colorNum] || colorValue["100"];
  const iconGap =
    iconLeading && iconTrailing
      ? "gap-2"
      : iconLeading || iconTrailing
      ? "gap-1"
      : "";

  return (
    <button
      {...restProps}
      className={`${className} ${buttonColor} disabled:bg-gray-200 disabled:text-white disabled:border-none disabled:cursor-not-allowed`}
    >
      <div
        className={`flex items-center justify-center leading-none ${iconGap}`}
      >
        <>{iconLeading}</>
        {children}
        <>{iconTrailing}</>
      </div>
    </button>
  );
}
