"use client";

import Image from "next/image";
import { SkeletonMasonry } from "./SkeletonMasonry";
import { CollectionItem } from "../sections.type";

export const CollectionSection = ({ data }: { data: CollectionItem[] }) => {
  return (
    <div className="h-[800px] overflow-y-auto pr-1">
      {data.length < 1 ? (
        <SkeletonMasonry />
      ) : (
        <div className="columns-4 gap-4">
          {data.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="break-inside-avoid mb-4 relative"
              style={{ height: "250px" }}
            >
              {item.image?.imageUrl && (
                <Image
                  src={item.image.imageUrl}
                  alt="collection"
                  className="w-full h-auto rounded-md bg-gray-100"
                  fill
                  sizes="25vw"
                  priority={index === 0}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
