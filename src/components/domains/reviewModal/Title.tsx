export const Title = ({ children }: { children: React.ReactNode }) => {
  return (
    <h1 className="font-semibold text-headline-2 pt-6 w-full text-center">
      {children}
    </h1>
  );
};
