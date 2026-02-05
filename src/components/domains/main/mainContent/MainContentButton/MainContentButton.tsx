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
          fetchPriority={isPriority ? "high" : undefined}
          loading={isPriority ? "eager" : "lazy"}
          className="object-cover rounded-xl"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 340px, 340px"
          quality={55}
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmNWY1ZjUiLz48L3N2Zz4="
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
