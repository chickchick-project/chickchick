import { PropsWithChildren } from "react";

export const SectionTitle = ({
  itemCount,
  children,
}: PropsWithChildren<{ itemCount?: number }>) => {
  return (
    <h2 className="pl-5 pc:pl-0 text-black-100 font-semibold text-title-2 tablet:text-headline-2">
      {children} {itemCount}
    </h2>
  );
};
