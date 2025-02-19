import { ReactNode } from "react";
import ButtonBase from "./buttonBase";

interface IButtonFilledProps extends React.ComponentProps<"button"> {
  children: ReactNode;
  colorNum?: string;
}

const buttonFilledBase = `h-auto text-center rounded-full `;

export function ButtonFilledPrimaryLFull({ children, colorNum = "100", ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      color="primary"
      colorNum={colorNum}
      className={`${buttonFilledBase} w-full text-white py-3 font-semibold text-body-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}

export function ButtonFilledPrimaryLFit({ children, colorNum = "100", ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      color="primary"
      colorNum={colorNum}
      className={`${buttonFilledBase} w-fit text-white py-3 px-4 font-semibold text-body-1 `}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}

export function ButtonFilledPrimarySFit({ children, colorNum = "100", ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      color="primary"
      colorNum={colorNum}
      className={`${buttonFilledBase} w-fit text-white py-2 px-3 font-medium text-label-1 `}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}

export function ButtonFilledGrayLFull({ children, ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      color="gray"
      colorNum="300"
      className={`${buttonFilledBase} w-full text-black-300 py-3 px-4 font-semibold text-body-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}
export function ButtonFilledGrayLFit({ children, ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      color="gray"
      colorNum="300"
      className={`${buttonFilledBase} w-fit text-black-300 py-3 px-4 font-semibold text-body-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}

export function ButtonFilledGrayLFixed({ children, className, ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      color="gray"
      colorNum="300"
      className={`${buttonFilledBase} ${className} text-black-300 py-3 px-4 font-semibold text-body-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}
