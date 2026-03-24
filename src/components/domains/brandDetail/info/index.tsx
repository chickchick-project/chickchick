"use client";

import ICONS from "@/shared/constants/icons";
import Image from "next/image";
import Link from "next/link";

interface IBrandInfoProps {
  brandName: string;
  brandDescription: string;
  brandUrl?: string;
  brandStores?: string;
}

export const BrandDetailInfo = ({
  brandName,
  brandDescription,
  brandUrl,
  brandStores,
}: IBrandInfoProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5 tablet:py-[60px] py-[40px] w-full tablet:px-0 px-5">
      <div className="text-black-100 tablet:text-4xl text-headline-3 font-bold">
        {brandName}
      </div>
      <div className="text-black-300 tablet:w-[720px] w-full text-center justify-start tablet:text-body-1 text-label-2 font-medium leading-normal whitespace-pre-line">
        {brandDescription}
      </div>

      <div className="flex flex-col items-center justify-center gap-1">
        {brandUrl && (
          <Link href={brandUrl} className="flex gap-1" target="_blank">
            <Image
              src={ICONS.Globe.src}
              alt={ICONS.Globe.alt}
              width={24}
              height={24}
              className="tablet:w-6 tablet:h-6 w-5 h-5"
            />
            <span className="text-black-300 tablet:text-body-1 text-label-2 font-semibold">
              공식사이트
            </span>
          </Link>
        )}
        {brandStores && (
          <Link href={brandStores} className="flex gap-1" target="_blank">
            <Image
              src={ICONS.Pin.src}
              alt={ICONS.Pin.alt}
              width={24}
              height={24}
              className="tablet:w-6 tablet:h-6 w-5 h-5"
            />
            <span className="text-black-300 tablet:text-body-1 text-label-2 font-semibold">
              오프라인 입점처
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};
