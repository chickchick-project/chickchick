import { ReactNode } from "react";

interface IButtonBaseProps extends React.ComponentProps<"button"> {
  children: ReactNode;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
  color: string;
  colorNum?: string;
}

type TColors = {
  [key: string]:
    | {
        [key: string]: string;
      }
    | string;
};
const colors: TColors = {
  primary: {
    "100": "bg-primary-100",
    "200": "bg-primary-200",
    "300": "bg-primary-300",
    "400": "bg-primary-400",
    "500": "bg-primary-500",
    "600": "bg-primary-600",
  },
  gray: {
    "100": "bg-gray-100",
    "200": "bg-gray-200",
    "300": "bg-gray-300",
  },
  white: "bg-white",
};
export default function ButtonBase(props: IButtonBaseProps) {
  const { children, className, iconLeading, iconTrailing, color, colorNum = "100", ...restProps } = props;

  const colorValue = colors[color];
  const buttonColor = typeof colorValue === "string" ? colorValue : colorValue[colorNum] || colorValue["100"];

  return (
    <button {...restProps} className={`${className} ${buttonColor} disabled:bg-gray-200 disabled:cursor-not-allowed`}>
      <>{iconLeading}</>
      <>{children}</>
      <>{iconTrailing}</>
    </button>
  );
}
