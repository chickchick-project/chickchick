interface IBrandTitleProps {
  brandName: string;
}

export const BrandDetailTitle = ({ brandName }: IBrandTitleProps) => {
  return (
    <div className="flex flex-col items-center justify-center tablet:py-[60px] py-[40px] w-full tablet:px-0 px-5">
      <div className="text-black-100 tablet:text-4xl text-headline-3 font-bold">
        {brandName}
      </div>
    </div>
  );
};
