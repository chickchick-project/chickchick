import Image from "next/image";
import Link from "next/link";
import IMAGES from "@/shared/constants/images";
import type { ApiBrandSimpleResponse } from "@/server/hono/schemas/brand.schema";

export function BrandSection({ brand }: { brand: ApiBrandSimpleResponse }) {
  const href = `/brand/${brand.nameKo ?? brand.nameEn}`;
  const displayName = brand.nameKo
    ? `${brand.nameKo} ${brand.nameEn}`
    : brand.nameEn;

  return (
    <section className="mt-10 px-4">
      <h3 className="text-headline-3 font-semibold">브랜드</h3>
      <Link href={href}>
        <div className="flex border p-5 my-5 gap-6 items-center rounded-xl">
          <Image
            src={IMAGES.Logo.src}
            alt={IMAGES.Logo.alt}
            width={160}
            height={68}
          />
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col">
              <span className="text-label-2 font-medium text-black-300">
                브랜드관
              </span>
              <span className="text-title-2 font-semibold text-black-100">
                {displayName} 바로가기
              </span>
            </div>
            <div>&gt;</div>
          </div>
        </div>
      </Link>
    </section>
  );
}
