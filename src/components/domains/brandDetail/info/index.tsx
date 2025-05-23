import ICONS from "@/lib/constants/icons";
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
    <div className="flex flex-col items-center justify-center gap-5 py-[60px] w-full">
      <div className="text-black-100 text-4xl font-bold">{brandName}</div>
      <div className="text-black-300 w-[720px] text-center justify-start text-base font-medium leading-normal whitespace-pre-line">
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
            />
            <span className="text-black-300 font-base font-semibold">
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
            />
            <span className="text-black-300 font-base font-semibold">
              오프라인 입점처
            </span>
          </Link>
        )}
      </div>
    </div>
  );
};
