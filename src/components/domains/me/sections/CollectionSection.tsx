import { useMemo } from "react";
import { CollectionItem } from "./me.sections.type";
import Image from "next/image";

export const CollectionSection = ({ data }: { data: CollectionItem[] }) => {
  const extendedDataWithHeights = useMemo(() => {
    const extended = Array.from({ length: 10 }).flatMap(() => data);
    return extended.map((item) => ({
      ...item,
      randomHeight: item.imageHeight ?? Math.floor(Math.random() * 200) + 150,
    }));
  }, [data]);

  return (
    <div className="max-h-[800px] overflow-y-auto pr-1">
      <div className="columns-4 gap-4">
        {extendedDataWithHeights.map((item, index) => {
          return (
            <div
              key={`${item.id}-${index}`}
              className="break-inside-avoid mb-4 relative"
              style={{ height: `${item.randomHeight}px` }}
            >
              <Image
                src={`https://picsum.photos/seed/${item.id}-${index}/300`}
                alt="collection"
                className={`w-full h-auto rounded-md bg-gray-100`}
                fill
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
