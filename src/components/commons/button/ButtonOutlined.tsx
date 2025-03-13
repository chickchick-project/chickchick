import ButtonBase from "./ButtonBase";
import { IButtonFilledProps, buttonLargeHeight, buttonSmallHeight } from "./ButtonFilled";

interface IButtonOutlinedProps extends Omit<IButtonFilledProps, "colorNum"> {}

const buttonOutlinedBase = `text-center rounded-full leading-none flex justify-center items-center border `;
const outlinePrimary = "border-primary-100 text-primary-100";
const outlineGray = "border-gray-100 text-black-100";

export function ButtonOutlinedPrimaryLFull({ children, ...rest }: IButtonOutlinedProps) {
  return (
    <ButtonBase
      bgColor="white"
      className={`${buttonOutlinedBase} ${buttonLargeHeight} ${outlinePrimary} w-full py-3 font-semibold text-body-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}

export function ButtonOutlinedPrimaryLFit({ children, ...rest }: IButtonOutlinedProps) {
  return (
    <ButtonBase
      bgColor="white"
      className={`${buttonOutlinedBase} ${buttonLargeHeight} ${outlinePrimary} w-fit py-3 px-4 font-semibold text-body-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}

export function ButtonOutlinedGraySFit({ children, iconTrailing, ...rest }: IButtonOutlinedProps) {
  return (
    <ButtonBase
      bgColor="white"
      className={`${buttonOutlinedBase}  ${buttonSmallHeight} ${outlineGray} w-fit py-2 ${
        iconTrailing ? "pl-3 pr-2" : "px-3"
      } font-medium text-label-1`}
      {...rest}
    >
      {children}
    </ButtonBase>
  );
}
