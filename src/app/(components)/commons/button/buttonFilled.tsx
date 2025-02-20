import { ReactNode } from "react";
import ButtonBase, { IButtonBaseProps } from "./buttonBase";

export interface IButtonFilledProps extends Omit<IButtonBaseProps, "bgColor"> {}

export const buttonLargeHeight = "h-[43px]";
export const buttonSmallHeight = "h-[33px]";
const buttonFilledBase = `text-center rounded-full leading-none flex justify-center items-center `;

export function ButtonFilledPrimaryLFull({ children, colorNum = "100", ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      bgColor="primary"
      colorNum={colorNum}
      className={`${buttonFilledBase} ${buttonLargeHeight} w-full text-white py-3 font-semibold text-body-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}

export function ButtonFilledPrimaryLFit({ children, colorNum = "100", ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      bgColor="primary"
      colorNum={colorNum}
      className={`${buttonFilledBase} ${buttonLargeHeight} w-fit text-white py-3 px-4 font-semibold text-body-1 `}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}

export function ButtonFilledPrimarySFit({ children, colorNum = "100", ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      bgColor="primary"
      colorNum={colorNum}
      className={`${buttonFilledBase} ${buttonSmallHeight} w-fit text-white py-2 px-3 font-medium text-label-1 `}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}

export function ButtonFilledGrayLFull({ children, ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      bgColor="gray"
      colorNum="300"
      className={`${buttonFilledBase} ${buttonLargeHeight} w-full text-black-300 py-3 px-4 font-semibold text-body-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}
export function ButtonFilledGrayLFit({ children, ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      bgColor="gray"
      colorNum="300"
      className={`${buttonFilledBase} ${buttonLargeHeight} w-fit text-black-300 py-3 px-4 font-semibold text-body-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}

export function ButtonFilledGrayLFixed({ children, className, ...rest }: IButtonFilledProps) {
  return (
    <ButtonBase
      bgColor="gray"
      colorNum="300"
      className={`${buttonFilledBase} ${buttonLargeHeight} ${className} text-black-300 py-3 px-4 font-semibold text-body-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}
