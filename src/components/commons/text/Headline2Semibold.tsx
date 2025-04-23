interface IHeadline2SemiboldProps {
  children: React.ReactNode;
}
export const Headline2Semibold = ({ children }: IHeadline2SemiboldProps) => {
  return (
    <div className="text-headline-2 font-semibold text-black-100">
      {children}
    </div>
  );
};
