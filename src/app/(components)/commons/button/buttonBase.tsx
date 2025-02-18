import { ReactNode } from "react";

interface IButtonBaseProps extends React.ComponentProps<"button"> {
  children: ReactNode;
  iconLeading?: ReactNode;
  iconTrailing?: ReactNode;
}

export default function ButtonBase(props: IButtonBaseProps) {
  const { children, className, iconLeading, iconTrailing, ...restProps } = props;
  return (
    <button {...restProps} className={`${className} disabled:bg-gray-200 disabled:cursor-not-allowed`}>
      <>{iconLeading}</>
      <>{children}</>
      <>{iconTrailing}</>
    </button>
  );
}
