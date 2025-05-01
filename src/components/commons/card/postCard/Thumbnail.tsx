import Image from "next/image";
import { POST_CARD_TYPES, PostCardType } from "@/lib/constants/post";

interface ThumbnailProps {
  thumbnail?: string;
  cardType: PostCardType;
  isLoading?: boolean;
}

const thumbnailSizes = {
  [POST_CARD_TYPES.SMALL]: { width: 80, height: 80 },
  [POST_CARD_TYPES.DEFAULT]: { width: 100, height: 100 },
  [POST_CARD_TYPES.DETAIL]: { width: 307, height: 180 },
};

export default function Thumbnail({ thumbnail, cardType, isLoading = false }: ThumbnailProps) {
  const { width, height } = thumbnailSizes[cardType];

  if (isLoading) {
    return <div className="animate-pulse bg-gray-300 rounded-md" style={{ width, height }} />;
  }

  return (
    <div className="relative">
      {thumbnail ? (
        <Image src={thumbnail} alt="게시글 썸네일" width={width} height={height} className="object-cover rounded-md" />
      ) : (
        <div
          className="bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-xs"
          style={{ width, height }}
        />
      )}
    </div>
  );
}
