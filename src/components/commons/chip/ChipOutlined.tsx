import ChipBase, { IChipBaseProps } from "./ChipBase";

type IChipOutlinedProps = Omit<IChipBaseProps, "bgColor" | "colorNum">;

export function ChipOutlinedPrimary(props: IChipOutlinedProps) {
  const { children, className, ...rest } = props;
  return (
    <ChipBase
      bgColor="white"
      className={`${className} text-primary-300 border border-primary-300`}
      {...rest}
    >
      {children}
    </ChipBase>
  );
}
