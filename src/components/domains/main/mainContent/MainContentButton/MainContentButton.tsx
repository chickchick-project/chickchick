"use client";

import Link from "next/link";

interface IMaincontentButtonProps {
  link: string;
  title: string | JSX.Element;
  linkText: string | JSX.Element;
  bgImage?: string;
}

export const MainContentButton = ({
  link,
  title,
  linkText,
  bgImage,
}: IMaincontentButtonProps) => {
  return (
    <Link
      href={link}
      className="tablet:w-[340px] w-full h-[200px] bg-neutral-100 rounded-xl inline-flex flex-col justify-start items-start gap-12 "
    >
      <div
        className="w-full h-full rounded-xl flex flex-col justify-between items-start flex-1 p-8 overflow-hidden relative"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-full h-full absolute top-0 left-0 self-stretchs bg-gradient-to-l from-black-100/30 to-[#000]/50 rounded-xl" />
        <div className=" text-white text-headline-2 font-semibold z-10 whitespace-pre-line">
          {title}
        </div>
        <div className="text-right  text-white font-semibold z-10">
          {linkText}
        </div>
      </div>
    </Link>
  );
};
