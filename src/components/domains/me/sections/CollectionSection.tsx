type CollectionItem = {
  id: number;
  name: string;
};

export const CollectionSection = ({ data }: { data: CollectionItem[] }) => (
  <div className="grid grid-cols-4 gap-4">
    {data.map((item) => (
      <div key={item.id} className="bg-gray-100 h-40 rounded-md" />
    ))}
  </div>
);
