import React from "react";
import Image from "next/image";

interface IconBadgeProps {
  iconSrc: string;
  altText: string;
  count: number;
}

const MAX_COUNT = 999;

const IconBadge: React.FC<IconBadgeProps> = ({ iconSrc, altText, count }) => {
  const formattedCount = count > MAX_COUNT ? `${MAX_COUNT}+` : count;

  return (
    <span className="flex items-center gap-0.5 text-gray-100 text-label-2">
      <Image src={iconSrc} alt={altText} width={20} height={20} unoptimized />
      {formattedCount}
    </span>
  );
};

export default IconBadge;
