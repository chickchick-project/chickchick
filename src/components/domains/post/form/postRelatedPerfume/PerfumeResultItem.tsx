import Image from "next/image";
import ICONS from "@/shared/constants/icons";
import type { ApiPerfumeSimpleResponse } from "@/server/hono/schemas/perfume.schema";

import clsx from "clsx";

interface PerfumeResultItemProps {
  perfume: ApiPerfumeSimpleResponse;
  onToggle: (perfume: ApiPerfumeSimpleResponse) => void;
  isSelected: boolean;
  isTempSelected: boolean;
  isDisabled: boolean;
}

export default function PerfumeResultItem({
  perfume,
  onToggle,
  isSelected,
  isTempSelected,
  isDisabled,
}: PerfumeResultItemProps) {
  const { brand, perfumeImage } = perfume;
  const perfumeName = perfume?.nameKo || perfume.nameEn;
  const brandName = brand?.nameKo || brand.nameEn;
  const isChecked = isTempSelected || isSelected;

  return (
    <li
      className={clsx("flex items-center p-3 transition-colors duration-150", {
        "bg-primary-600 cursor-not-allowed": isSelected,
        "bg-primary-600 hover:bg-gray-300 cursor-pointer": isTempSelected,
        "bg-gray-200 cursor-not-allowed": isDisabled,
        "hover:bg-gray-300 cursor-pointer":
          !isSelected && !isTempSelected && !isDisabled,
      })}
      onClick={() => !isSelected && !isDisabled && onToggle(perfume)}
    >
      <figure className="flex items-center">
        <div className="relative w-10 h-10 rounded-md mr-4 bg-white p-1 flex items-center justify-center border">
          <Image
            src={perfumeImage?.imageUrl ?? "/images/BlurShimmer.svg"}
            alt={perfumeName || "Perfume Image"}
            sizes="40px"
            fill
            placeholder="blur"
            blurDataURL="/images/BlurShimmer.svg"
            className="w-10 h-10 rounded-md mr-4 object-contain"
          />
        </div>
        <figcaption>
          <p className="font-semibold text-gray-800">{perfumeName}</p>
          <p className="text-sm text-gray-500">{brandName}</p>
        </figcaption>
      </figure>

      <div
        className={`ml-auto w-6 h-6 flex items-center justify-center ${
          isSelected && "border border-primary-100 rounded-full"
        }`}
      >
        {isChecked && (
          <Image
            src={ICONS.CheckPrimary.src}
            alt={ICONS.CheckPrimary.alt}
            width={24}
            height={24}
          />
        )}
      </div>
    </li>
  );
}
