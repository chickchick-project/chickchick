const skeletonHeightsCols = [
  [150, 300, 278],
  [340, 190, 198],
  [160, 320, 248],
  [350, 180, 198],
];

export const SkeletonMasonry = () => (
  <div className="columns-4 gap-4 animate-pulse" aria-hidden="true">
    {skeletonHeightsCols.map((heights, colIndex) => (
      <div key={colIndex} className="column">
        {heights.map((height, rowIndex) => (
          <div
            key={rowIndex}
            className="inline-block w-full bg-gray-200 rounded-lg mb-4 break-inside-avoid"
            style={{ height }}
          />
        ))}
      </div>
    ))}
  </div>
);
