import Image from "next/image";
import { THUMBNAIL_SIZES } from "./postCard.constants";
import { ThumbnailProps } from "./postCard.types";

export default function Thumbnail({
  thumbnail,
  cardType,
  isLoading = false,
}: ThumbnailProps) {
  const { width, height } = THUMBNAIL_SIZES[cardType];

  if (isLoading) {
    return (
      <div
        className="animate-pulse bg-gray-300 rounded-md"
        style={{ width, height }}
      />
    );
  }

  return (
    <div className="relative">
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt="게시글 썸네일"
          width={width}
          height={height}
          className="object-cover rounded-md"
        />
      ) : (
        <div
          className="bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs"
          style={{ width, height }}
        />
      )}
    </div>
  );
}
