import React from "react";
import Image from "next/image";
import { IconBadgeProps } from "./author.types";

const MAX_COUNT = 999;

export default function IconBadge({ iconSrc, altText, count }: IconBadgeProps) {
  const formattedCount = count > MAX_COUNT ? `${MAX_COUNT}+` : count;

  return (
    <span className="flex items-center gap-0.5 text-gray-100 text-label-2">
      <Image src={iconSrc} alt={altText} width={20} height={20} unoptimized />
      {formattedCount}
    </span>
  );
}
