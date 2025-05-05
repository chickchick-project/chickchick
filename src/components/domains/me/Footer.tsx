import React from "react";

const ScrollRowSection = ({
  title,
  children,
  gap = "gap-x-2",
}: {
  title: string;
  children: React.ReactNode;
  gap?: string;
}) => (
  <div className="flex flex-col gap-y-5">
    <span className="text-headline-2 font-semibold ml-[50px]">{title}</span>
    <div className="relative w-[1200px]">
      <div className="absolute left-0 top-1/2 -translate-y-1/2">&lt;</div>
      <div className={`flex justify-center ${gap}`}>{children}</div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2">&gt;</div>
    </div>
  </div>
);

const MeFooter = () => {
  return (
    <div className="flex flex-col gap-y-16 mt-[60px]">
      <ScrollRowSection title="최근에 본 게시글 10">
        <div className="w-[540px] h-[235px] bg-gray-100"></div>
        <div className="w-[540px] h-[235px] bg-gray-100"></div>
      </ScrollRowSection>
      <ScrollRowSection title="최근에 본 향수 10" gap="gap-x-[50px]">
        <div className="w-[180px] h-[180px] bg-gray-100"></div>
        <div className="w-[180px] h-[180px] bg-gray-100"></div>
        <div className="w-[180px] h-[180px] bg-gray-100"></div>
        <div className="w-[180px] h-[180px] bg-gray-100"></div>
        <div className="w-[180px] h-[180px] bg-gray-100"></div>
      </ScrollRowSection>
    </div>
  );
};

export default MeFooter;
