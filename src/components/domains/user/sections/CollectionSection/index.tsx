"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SkeletonMasonry } from "./SkeletonMasonry";
import { CollectionItem } from "../sections.type";

export const CollectionSection = ({ data }: { data: CollectionItem[] }) => {
  const [extendedDataWithHeights, setExtendedDataWithHeights] = useState<
    CollectionItem[]
  >([]);

  useEffect(() => {
    const extended = Array.from({ length: 10 }).flatMap(() => data);
    const withHeights = extended.map((item) => ({
      ...item,
    }));
    setExtendedDataWithHeights(withHeights);
  }, [data]);

  return (
    <div className="h-[800px] overflow-y-auto pr-1">
      {extendedDataWithHeights.length < 1 ? (
        <SkeletonMasonry />
      ) : (
        <div className="columns-4 gap-4">
          {extendedDataWithHeights.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="break-inside-avoid mb-4 relative"
              style={{ height: `${Math.floor(Math.random() * 200) + 150}px` }}
            >
              <Image
                src={`https://picsum.photos/seed/${item.id}-${index}/300`}
                alt="collection"
                className="w-full h-auto rounded-md bg-gray-100"
                fill
                sizes="25vw"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
