import { CollectionItem } from "./me.sections.type";

export const CollectionSection = ({ data }: { data: CollectionItem[] }) => {
  const extendedData = Array.from({ length: 10 }).flatMap(() => data);

  return (
    <div className="max-h-[800px] overflow-y-auto pr-1">
      <div className="columns-4 gap-4">
        {extendedData.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            style={{ height: `${150 + Math.random() * 200}px` }}
            className="break-inside-avoid bg-gray-100 rounded-md mb-4"
          />
        ))}
      </div>
    </div>
  );
};
