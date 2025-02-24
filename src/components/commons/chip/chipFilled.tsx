import ChipBase, { IChipBaseProps } from "./chipBase";

interface IChipFilledProps extends Omit<IChipBaseProps, "bgColor" | "colorNum"> {}

export function ChipFilled(props: IChipFilledProps) {
  const { children, className, ...rest } = props;
  return (
    <ChipBase className={`${className}`} {...rest}>
      {children}
    </ChipBase>
  );
}

export function ChipFilledPrimary(props: IChipFilledProps) {
  const { children, className, ...rest } = props;
  return (
    <ChipBase bgColor="primary" colorNum="300" className={`${className} text-white`} {...rest}>
      {children}
    </ChipBase>
  );
}

export function ChipFilledGray(props: IChipFilledProps) {
  const { children, className, ...rest } = props;
  return (
    <ChipBase bgColor="gray" colorNum="300" className={`${className} text-black-200`} {...rest}>
      {children}
    </ChipBase>
  );
}
