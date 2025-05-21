import clsx from "clsx";

export const MobileSeparator = ({
  className,
  mobileOnly = true,
}: {
  className?: string;
  mobileOnly?: boolean;
}) => {
  return (
    <hr
      className={clsx(
        "w-full h-2 bg-gray-300 my-10 border-0",
        mobileOnly && "pc:hidden",
        className
      )}
    />
  );
};
