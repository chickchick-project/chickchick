"use client";

import Link from "next/link";
import Image from "next/image";
import type { StaticImageData } from "next/image";

interface IMaincontentButtonProps {
  link: string;
  title: string | JSX.Element;
  linkText: string | JSX.Element;
  bgImage: {
    src: StaticImageData;
    alt: string;
  };
  isPriority?: boolean;
}

export const MainContentButton = ({
  link,
  title,
  linkText,
  bgImage,
  isPriority = false,
}: IMaincontentButtonProps) => {
  return (
    <Link
      href={link}
      className="pc:w-[340px] w-full tablet:h-[200px] h-[140px] bg-neutral-100 rounded-xl inline-flex flex-col justify-start items-start gap-12 "
    >
      <div className="w-full h-full rounded-xl flex flex-col justify-between items-start flex-1 tablet:p-8 p-6 overflow-hidden relative">
        <Image
          src={bgImage.src}
          alt={bgImage.alt}
          fill
          priority={isPriority}
          className="object-cover rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 340px"
        />
        <div className="w-full h-full absolute top-0 left-0 self-stretchs bg-gradient-to-l from-black-100/30 to-[#000]/50 rounded-xl z-10" />
        <div className=" text-white tablet:text-headline-2 text-title-2 font-semibold z-20 whitespace-pre-line">
          {title}
        </div>
        <div className="text-right text-white tablet:text-body-1 text-label-2 font-semibold z-20">
          {linkText}
        </div>
      </div>
    </Link>
  );
};
