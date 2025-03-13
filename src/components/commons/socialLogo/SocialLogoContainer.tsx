interface ISocialLogoContainer {
  children: React.ReactNode;
}

export const SocialLogoContainer = ({ children }: ISocialLogoContainer) => {
  return <div className="flex justify-center items-center rounded-full w-[72px] h-[72px] bg-white">{children}</div>;
};
