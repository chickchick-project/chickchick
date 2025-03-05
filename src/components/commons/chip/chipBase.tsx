import { BACKGROUND_COLORS, TBgColor } from "@/lib/constants/colors";
import { ReactNode } from "react";

export interface IChipBaseProps extends React.ComponentProps<"div"> {
  children: ReactNode;
  bgColor?: TBgColor;
  colorNum?: string;
}

export default function ChipBase(props: IChipBaseProps) {
  const { children, bgColor, colorNum = "300", className, ...restProps } = props;

  const chipBaseStyle =
    "w-fit text-center rounded leading-none flex justify-center items-center font-medium hover:select-none";

  const bgColorValue = bgColor ? BACKGROUND_COLORS[bgColor] : "";
  const chipColor =
    typeof bgColorValue === "string" ? bgColorValue : bgColorValue?.[colorNum] || bgColorValue?.["300"] || "";

  return (
    <div className={`${className} ${chipBaseStyle} ${chipColor}`} {...restProps}>
      {children}
    </div>
  );
}
