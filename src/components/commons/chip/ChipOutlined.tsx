import ChipBase, { IChipBaseProps } from "./ChipBase";

type IChipOutlinedProps = Omit<IChipBaseProps, "bgColor" | "colorNum">;

export function ChipOutlinedPrimary(props: IChipOutlinedProps) {
  const { children, className, ...rest } = props;
  return (
    <ChipBase
      bgColor="white"
      className={`${className} text-primary-250 border border-primary-250`}
      {...rest}
    >
      {children}
    </ChipBase>
  );
}
